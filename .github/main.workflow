name: DotCMS/core-web Tests
on:
    pull_request:
        types: [synchronize, opened, reopened, ready_for_review]
    push:
        branches:
            - master
            - release-*
env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GH_TOKEN: ${{ secrets.CICD_GITHUB_TOKEN }}
    PULL_REQUEST_URL: ${{ github.event.pull_request._links.html.href }}
    IS_PULL_REQUEST: ${{ github.event_name == 'pull_request' }}
    HEAD_REF: ${{ github.head_ref }}
jobs:
    module-matcher-job:
        name: Module Matcher
        runs-on: ubuntu-latest
        outputs:
            module_found: ${{ steps.module-matcher.outputs.module_found }}
        steps:
            - id: fetch-core
              name: Fetch Core repo
              uses: actions/checkout@v3
              with:
                  fetch-depth: 0
            - id: module-matcher
              name: Module Matcher
              uses: ./.github/actions/module-matcher
              with:
                  current: ui
    lint:
        runs-on: ubuntu-latest
        needs: module-matcher-job
        if: needs.module-matcher-job.outputs.module_found == 'true'
        steps:
            - name: Checkout
              uses: actions/checkout@v3
              with:
                  persist-credentials: false
                  fetch-depth: 1
            - uses: actions/cache@v2
              with:
                  path: |
                      ./ui/node_modules
                  key: ${{ runner.os }}-modules-${{ hashFiles('./ui/**/package-lock.json') }}
            - name: Configuring Node.js
              uses: actions/setup-node@v2-beta
              with:
                  node-version: '16.13.2'
            - name: Installing dependencies
              run: |
                  cd ui
                  npm install
            - name: Running Lint in dotcms-ui
              id: lint_step
              run: |
                  cd ui
                  if ! (npm run nx lint -- dotcms-ui) then
                    echo "::set-output name=status::failure";
                    echo "::set-output name=color::#ff2400";
                    exit 1;
                  fi
            - name: Slack Notification
              if: failure()
              uses: rtCamp/action-slack-notify@master
              env:
                  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
                  SLACK_USERNAME: core-web
                  SLACK_ICON: https://user-images.githubusercontent.com/751424/155223164-b5f1bd4b-4b99-4f1d-8ae6-bfa47b1b2f54.png
                  SLACK_COLOR: ${{ steps.lint_step.outputs.color }}
                  SLACK_TITLE: 'Lint: (FAILED)'
                  SLACK_MESSAGE: https://github.com/${{github.repository}}/actions/runs/${{github.run_id}}
                  SLACK_FOOTER: ${{ env.PULL_REQUEST_URL }}
    build:
        needs: [module-matcher-job, lint]
        if: needs.module-matcher-job.outputs.module_found == 'true' && github.event.pull_request.draft == false
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v3
              with:
                  persist-credentials: false
                  fetch-depth: 1
            - uses: actions/cache@v2
              with:
                  path: |
                      ./ui/node_modules
                  key: ${{ runner.os }}-modules-${{ hashFiles('./ui/**/package-lock.json') }}
            - name: Configuring Node.js
              uses: actions/setup-node@v2-beta
              with:
                  node-version: '16.13.2'
            - name: Installing dependencies
              run: |
                  cd ui
                  npm install
            - name:
                  Building for production
                  ## Build dotcms-webcomponents because dotcms-ui doesn't have the lib as a direct dep
                  ## so Nx can't be identified and build it.
              run: |
                  cd ui
                  npm run nx build dotcms-webcomponents && npm run nx build dotcms-ui -- --prod
            - name: Running tests
              id: test_run
              run: |
                  cd ui
                  if ! (npm run nx test --target=dotcms-ui --prod) then
                    echo "::set-output name=status::failure";
                    echo "::set-output name=color::#ff2400";
                    exit 1;
                  else
                    echo "::set-output name=status::success";
                    echo "::set-output name=color::#5E7D00";
                  fi
            - name: Push Tests to GitHub
              id: persist_results
              if: success() || failure()
              run: |
                  chmod +x .cicd/github.sh && source .cicd/github.sh
                  persistResults
                  echo "::set-output name=message::$(logResults)";
            - name: Slack Notification
              if: success() || failure()
              uses: rtCamp/action-slack-notify@master
              env:
                  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
                  SLACK_USERNAME: core-web
                  SLACK_ICON: https://avatars.slack-edge.com/2020-09-21/1362682893351_5b474f175640cf5f5912_72.png
                  SLACK_COLOR: ${{ steps.test_run.outputs.color }}
                  SLACK_TITLE: 'Report: (${{ steps.test_run.outputs.status }})'
                  SLACK_MESSAGE: ${{ steps.persist_results.outputs.message }}
                  SLACK_FOOTER: ${{ env.PULL_REQUEST_URL }}
