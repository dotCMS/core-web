#!/bin/bash

# Examples
# https://storage.googleapis.com/cicd-246518-tests/0253ef83/mysql/reports/html/integrationTest/index.html
# https://storage.googleapis.com/cicd-246518-tests/0253ef83/mysql/logs/dotcms.log
# https://storage.googleapis.com/cicd-246518-tests/0253ef83/unit/reports/html/index.html
# https://storage.googleapis.com/cicd-246518-tests/0253ef83/unit/logs/dotcms.log
# https://storage.googleapis.com/cicd-246518-tests/branch-name/mysql/reports/html/integrationTest/index.html
# https://storage.googleapis.com/cicd-246518-tests/branch-name/mysql/logs/dotcms.log
# https://storage.googleapis.com/cicd-246518-tests/branch-name/unit/reports/html/index.html
# https://storage.googleapis.com/cicd-246518-tests/branch-name/unit/logs/dotcms.log

outputFolder="/karma_html/HeadlessChrome 78.0.3904 (Mac OS X 10.14.5)/index.html"
credentialsFile="./credentials.json"
buckedProtocol="gs://"

# Do we have service account permissions
if [ -z "${GOOGLE_CREDENTIALS_BASE64}" ]
then
    echo ""
    echo "======================================================================================"
    echo " >>>      'GOOGLE_CREDENTIALS_BASE64' environment variable NOT FOUND               <<<"
    echo "======================================================================================"
    exit 0
fi

if [ -z "${BUILD_HASH}" ]
then
    echo ""
    echo "======================================================================================"
    echo " >>>                'BUILD_HASH' environment variable NOT FOUND                    <<<"
    echo "======================================================================================"
    exit 0
fi

if [ -z "${BUILD_ID}" ]
then
    echo ""
    echo "======================================================================================"
    echo " >>>                'BUILD_ID' environment variable NOT FOUND                    <<<"
    echo "======================================================================================"
    exit 0
fi

# Validating if we have something to copy
if [ -z "$(ls -A $outputFolder)" ]; then
   echo ""
   echo "================================================================"
   echo "           >>> EMPTY [${outputFolder}] FOUND <<<"
   echo "================================================================"
   exit 0
fi

echo $GOOGLE_CREDENTIALS_BASE64 | base64 -d - > $credentialsFile

echo ""
echo "  >>> Pushing reports and logs to [${buckedProtocol}${GOOGLE_STORAGE_JOB_COMMIT_FOLDER}] <<<"
echo "  >>> Pushing reports and logs to [${buckedProtocol}${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}] <<<"
echo ""


gcloud auth activate-service-account --key-file="${credentialsFile}"
gsutil -m -q cp -a public-read -r ${outputFolder} ${buckedProtocol}${GOOGLE_STORAGE_JOB_COMMIT_FOLDER}

# When the bucket has the branch name we need to clean up the bucket first
gsutil -q rm ${buckedProtocol}${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}/**
gsutil -m -q cp -a public-read -r ${outputFolder} ${buckedProtocol}${GOOGLE_STORAGE_JOB_BRANCH_FOLDER}
