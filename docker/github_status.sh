#! /bin/sh

GITHUB_STATUS="failure"
GITHUB_DESCRIPTION="Tests FAILED"
if [ ${CURRENT_JOB_BUILD_STATUS} == 0 ]
then
  GITHUB_STATUS="success"
  GITHUB_DESCRIPTION="Tests executed SUCCESSFULLY"
fi

if [ "$COMMIT_SHORT" != "false" ];
then

  BASE_GOOGLE_URL="https://storage.googleapis.com/"

  reportsIndexURL="${GOOGLE_STORAGE_JOB_COMMIT_FOLDER}/report.html    "
  statusesContext="Travis CI - Test"


#  logURL="${BASE_GOOGLE_URL}${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}/logs/dotcms.log"

  echo ""
  echo "================================================================================"
  echo "================================================================================"
  echo "  >>>   Storage folder for job: [${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}]"
  echo "  >>>   Reports URL for job: [${reportsIndexURL}]"
  echo "  >>>   Log URL for job: [${logURL}]"
  echo "  >>>   GITHUB pull request: [https://github.com/dotCMS/core-web/pulls/${COMMIT_SHORT}]"
  echo "  >>>   Job build status: ${CURRENT_JOB_BUILD_STATUS}"
  echo "  >>>   GITHUB user: ${GITHUB_USER}/${GITHUB_USER_TOKEN}"
  echo "================================================================================"
  echo "================================================================================"
  echo ""

  jsonBaseValue="https://api.github.com/repos/dotCMS/core-web/statuses/"
  jsonAttribute="\"href\": \"${jsonBaseValue}"

  # https://developer.github.com/v3/auth/#via-oauth-tokens

  # Reading the pull request information in order to get the statuses URL (has a github PR identifier)

  # https://developer.github.com/v3/pulls/#get-a-single-pull-request
  jsonResponse=$(curl -u ${GITHUB_USER}:${GITHUB_USER_TOKEN} \
  --request GET https://api.github.com/repos/dotCMS/core-web/pulls/${COMMIT_SHORT} -s)

  # Parse the response json to get the statuses URL
  jsonStatusesAttribute=`echo "$jsonResponse" | grep "${jsonAttribute}\w*\""`
  statusesURL=`echo "$jsonStatusesAttribute" | grep -o "${jsonBaseValue}\w*"`


  
  echo 'statusesURL'
  echo $statusesURL

  # https://developer.github.com/v3/repos/statuses/#create-a-status
  # The state of the status. Can be one of error, failure, pending, or success.
  curl -u ${GITHUB_USER}:${GITHUB_USER_TOKEN} \
  --request POST \
  --data "{
    \"state\": \"${GITHUB_STATUS}\",
    \"description\": \"${GITHUB_DESCRIPTION}\",
    \"target_url\": \"${reportsIndexURL}\",
    \"context\": \"${statusesContext}\"
  }" \
  $statusesURL -s
fi