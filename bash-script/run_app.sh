#!/bin/bash

# Infinite loop to continuously run node app.js
while true; do
  echo "Starting node app.js..."
  
  # Run the Node.js application
  node app.js
  
  # Check if the process exited successfully
  if [ $? -eq 0 ]; then
    echo "node app.js completed successfully."
  else
    echo "node app.js encountered an error. Retrying..."
  fi
  
  # Optional: Add a delay before restarting
  sleep 2
done

