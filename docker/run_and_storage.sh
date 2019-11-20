echo 'Running test'
npm test -- dotcms-ui --watch=false --reporters=html,progress
export CURRENT_JOB_BUILD_STATUS=$?

if [ "${GOOGLE_CREDENTIALS_BASE64}" ];
 then
    echo 'Running storage'
    bash storage.sh

    echo 'Updating github status'
    bash github_satatus.sh

    exit $CURRENT_JOB_BUILD_STATUS
fi