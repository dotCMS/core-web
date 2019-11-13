echo 'Running test'
npm test -- dotcms-ui --watch=false --reporters=html,progress
npmTestExitValue=$?

echo 'Running storage'
bash storage.sh
exit $npmTestExitValue