#!/bin/bash

export TEST_TYPE=unit
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
exit $?
