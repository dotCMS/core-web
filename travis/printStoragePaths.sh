BASE_GOOGLE_URL="https://storage.googleapis.com/"

CURRENT_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH
if [ "$TRAVIS_PULL_REQUEST" = "false" ];
then
  CURRENT_BRANCH=$TRAVIS_BRANCH
fi


GOOGLE_STORAGE_JOB_COMMIT_FOLDER="cicd-246518-tests/core-web/${TRAVIS_COMMIT_SHORT}"
GOOGLE_STORAGE_JOB_BRANCH_FOLDER="cicd-246518-tests/core-web/${CURRENT_BRANCH}"
reportsCommitIndexURL="${BASE_GOOGLE_URL}${GOOGLE_STORAGE_JOB_COMMIT_FOLDER}/reports/html/index.html"
reportsBranchIndexURL="${BASE_GOOGLE_URL}${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}/reports/html/index.html"

echo ""
echo -e "\e[36m==========================================================================================================================\e[0m"
echo -e "\e[36m==========================================================================================================================\e[0m"
echo -e "\e[1;36m                                                REPORTING\e[0m"
echo
echo -e "\e[31m   ${reportsBranchIndexURL}\e[0m"
echo
echo -e "\e[31m   ${reportsCommitIndexURL}\e[0m"
echo
if [ "$TRAVIS_PULL_REQUEST" != "false" ];
then
  echo "   GITHUB pull request: [https://github.com/dotCMS/core-web/pull/${TRAVIS_PULL_REQUEST}]"
  echo
fi
echo -e "\e[36m==========================================================================================================================\e[0m"
echo -e "\e[36m==========================================================================================================================\e[0m"
echo ""