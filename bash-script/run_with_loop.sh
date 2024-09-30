#!/bin/bash

# Function to generate a random delay between 4 seconds (4 * 1000 milliseconds) and 10 minutes (10 * 60 * 1000 milliseconds)
generate_random_delay() {
  # Convert 4 seconds and 10 minutes to milliseconds
  min_delay=4000    # 4 seconds in milliseconds
  max_delay=600000  # 10 minutes in milliseconds

  # Generate a random delay in milliseconds
  random_delay=$(( (RANDOM % (max_delay - min_delay + 1)) + min_delay ))

  # Convert milliseconds to seconds
  delay_in_seconds=$(echo "scale=3; $random_delay / 1000" | bc)
  echo $delay_in_seconds
}

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
  
  # Generate a random delay
  delay=$(generate_random_delay)
  echo "Waiting for $delay seconds before restarting..."
  
  # Wait for the random delay before restarting
  sleep $delay
done
