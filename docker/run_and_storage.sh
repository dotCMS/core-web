echo 'Running test'
npm test -- dotcms-ui --watch=false --reporters=html,progress
npmTestExitValue=$?

if [ "${GOOGLE_CREDENTIALS_BASE64}" ];
 then
    echo 'Running storage'
    bash storage.sh

    echo 'Updating github status'
    bash github_satatus.sh

    exit $npmTestExitValue
fi