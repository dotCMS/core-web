echo 'Running test'
npm test -- dotcms-ui --watch=false --reporters=html,progress
ignoring_return_value=$?
echo 'Running storage'
bash storage.sh