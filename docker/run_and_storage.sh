echo 'Running test'
npm test -- dotcms-ui --watch=false --reporters=html,progress
npmTestExitValue=$?

if [ "${GOOGLE_CREDENTIALS_BASE64}" ] then
    echo 'Running storage'
    bash storage.sh
    exit $npmTestExitValue
fi