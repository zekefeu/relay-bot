FROM node:18.13-alpine3.17

# Use yarn v3
RUN yarn set version 3.3.0

WORKDIR /app

# Install dependencies
COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .

RUN yarn install

## Copy the source code
COPY . .

CMD yarn start
