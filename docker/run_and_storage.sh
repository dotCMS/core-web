export GOOGLE_CREDENTIALS_FILE_NAME=credentials.json
export GOOGLE_CREDENTIALS_FILE_PATH=${WORKING_DIR}/${GOOGLE_CREDENTIALS_FILE_NAME}

echo 'GOOGLE_CREDENTIALS_FILE_NAME'
echo ${GOOGLE_CREDENTIALS_FILE_NAME}
echo ${GOOGLE_CREDENTIALS_FILE_PATH}

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