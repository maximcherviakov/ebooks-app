###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:20 AS base
WORKDIR /usr/local/app


################  BACKEND STAGES  #################

FROM base AS backend-dev
RUN apt update
RUN apt install -y ghostscript graphicsmagick
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ .
COPY ./.env .
CMD ["npm", "run", "dev"]

################## CLIENT STAGES ##################

FROM base AS client-dev
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ .
COPY ./.env .
CMD ["npm", "run", "dev"]

FROM base AS client-test
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ .
COPY ./.env .
# Build for production
RUN npm run build
# Serve the production build
# CMD ["npx", "serve", "-s", "dist", "-p", "3000"]
CMD ["npm", "run", "dev"]

################### TEST STAGES ###################

FROM mcr.microsoft.com/playwright:v1.51.0-noble as ui-tests

WORKDIR /usr/local/app

# Install X11 utilities and VNC server for headed mode
RUN apt-get update && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY client/package*.json ./
COPY client/tests ./tests
COPY client/playwright.config.ts ./

# Install dependencies
RUN npm install

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Set up virtual display
ENV DISPLAY=:99
ENV SCREEN_WIDTH=1280
ENV SCREEN_HEIGHT=720
ENV SCREEN_DEPTH=24

# Add startup script
COPY client/tests/start.sh ./
RUN chmod +x ./start.sh

# Expose port for VNC
EXPOSE 5900

ENTRYPOINT ["./start.sh"]
CMD ["npx", "playwright", "test", "--headed"]