#!/bin/bash

# Function to generate a random number between min and max
random_sleep_time() {
    local min=$1
    local max=$2
    echo $(( ( RANDOM % (max - min + 1) ) + min ))
}

# Function to run Node.js app and perform tasks
run_tasks() {
    # Start TorGhost and get a new IP
    torghost -s
    if [ $? -ne 0 ]; then
        echo "TorGhost start failed. Exiting..."
        exit 1
    fi
    
    echo "Running Node.js app..."
    node /app/app.js
    if [ $? -ne 0 ]; then
        echo "Node.js app failed. Exiting..."
        exit 1
    fi

    # Rotate IP using TorGhost
    torghost -r
    if [ $? -ne 0 ]; then
        echo "TorGhost IP rotation failed. Exiting..."
        exit 1
    fi
    
    echo "Running Node.js app again..."
    node /app/app.js
    if [ $? -ne 0 ]; then
        echo "Node.js app failed. Exiting..."
        exit 1
    fi
}

while true; do
    # Generate random work time and sleep time
    work_time=$(random_sleep_time 3000 5000)  # Random work time between 1 and 2 hours (3600 to 7200 seconds)
    sleep_time=$(random_sleep_time 900 1200)  # Random sleep time between 10 and 20 minutes (600 to 1200 seconds)

    echo "Starting work cycle for $work_time seconds..."

    # Run tasks for a random period
    work_end_time=$(( $(date +%s) + work_time ))
    while [ $(date +%s) -lt $work_end_time ]; do
        run_tasks
        # Sleep for a short period to prevent rapid iteration
        sleep 60
    done

    echo "Work cycle completed. Sleeping for $sleep_time seconds..."
    sleep $sleep_time
done
