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