#!/bin/bash

bash travis/printStoragePaths.sh
ignoring_return_value=$?

# Using this approach in order to avoid travis timeouts waithing for log movement

function bell() {
  while true; do
    echo -e "\a"
    sleep 60
  done
}
bell &

gcloud builds submit \
  --config=travis/cloudrun-test.yml \
  --substitutions=_CUSTOM_RUN_ID=$TRAVIS_COMMIT_SHORT,_CURRENT_BRANCH=$TRAVIS_BRANCH,_COMMIT_SHORT=$TRAVIS_COMMIT_SHORT,_GOOGLE_CREDENTIALS_BASE64=$GOOGLE_CREDENTIALS_BASE64 .
exit $?
