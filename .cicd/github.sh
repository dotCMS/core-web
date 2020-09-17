#!/bin/bash

TEST_RESULTS="test-results"
GITHUB="github.com"
GITHACK="raw.githack.com"
GITHUB_TEST_RESULTS_PATH="dotCMS/${TEST_RESULTS}"
DOT_CICD_TARGET="core-web"
export GITHUB_TEST_RESULTS_HOST_PATH="${GITHUB}/${GITHUB_TEST_RESULTS_PATH}"
export GITHUB_TEST_RESULTS_URL="https://${GITHUB_TEST_RESULTS_HOST_PATH}"
export GITHACK_TEST_RESULTS_URL="https://${GITHACK}/${GITHUB_TEST_RESULTS_PATH}"
export GITHUB_TEST_RESULTS_REPO="${GITHUB_TEST_RESULTS_URL}.git"
export GITHUB_TEST_RESULTS_BROWSE_URL="${GITHACK_TEST_RESULTS_URL}/${GITHUB_SHA::8}/projects/${DOT_CICD_TARGET}"
export GITHUB_TEST_RESULTS_REMOTE="https://${GITHUB_USER_TOKEN}@${GITHUB_TEST_RESULTS_HOST_PATH}"
export GITHUB_TEST_RESULTS_REMOTE_REPO="https://${GITHUB_USER_TOKEN}@${GITHUB_TEST_RESULTS_HOST_PATH}.git"

function checkForToken {
  if [[ -z ${1} ]]; then
    echo "Error: Test results push token is not defined, aborting..."
    exit 1
  fi
  echo "Test results token found"
  echo ${GITHUB_TEST_RESULTS_BROWSE_URL}
}
