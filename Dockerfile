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

################### TEST STAGES ###################

# FROM mcr.microsoft.com/playwright:focal AS ui-tests
# WORKDIR /usr/local/app
# COPY client/package.json client/package-lock.json ./
# RUN npm install
# COPY client/tests/ .
# COPY ./.env .
# CMD ["xvfb-run", "npx", "playwright", "test", "--headed"]

# FROM base as ui-tests
# WORKDIR /usr/local/app
# COPY client/package*.json ./
# RUN npm ci
# COPY client ./client
# RUN npx playwright install --with-deps chromium

FROM base as ui-tests
WORKDIR /usr/local/app
# Install X11 dependencies including xauth
RUN apt-get update && apt-get install -y xvfb xauth
COPY client/package*.json ./
RUN npm ci
COPY client ./client
RUN npx playwright install --with-deps chromium