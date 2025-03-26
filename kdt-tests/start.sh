#!/bin/bash

# Start Xvfb
Xvfb :99 -screen 0 ${SCREEN_WIDTH}x${SCREEN_HEIGHT}x${SCREEN_DEPTH} &

# Start fluxbox window manager
fluxbox &

# Start VNC server
# x11vnc -display $DISPLAY -forever -shared -nopw -nolookup -allow 0.0.0.0 &

# Wait for client service to be ready
echo "Waiting for client service at $BASE_URL..."
# timeout 60s bash -c 'until curl -s "$BASE_URL" > /dev/null; do sleep 1; echo "Waiting for client..."; done'

# More robust check - wait for actual content to be available and stable
for i in {1..30}; do
  echo "Attempt $i: Checking if client is ready..."
  # Use a more robust check that waits for specific content
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL})
  
  if [ $HTTP_CODE -eq 200 ]; then
    echo "Client service responded with 200 OK!"
    # Add a longer pause to ensure React hydration completes
    echo "Waiting for client-side rendering to stabilize..."
    sleep 10
    break
  fi
  
  if [ $i -eq 30 ]; then
    echo "Timed out waiting for client service"
    exit 1
  fi
  
  sleep 2
done

echo "Client service is ready!"

# Execute the command passed to docker run
exec "$@"