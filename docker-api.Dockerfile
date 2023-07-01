FROM node:18-alpine as builder


WORKDIR /usr/src/app

# ========== dependencies for build ==================

COPY \
package*.json \
.

RUN true \
&& mkdir -p ./packages/api\
&& mkdir -p ./packages/common\
&& true

COPY \
./packages/api/package.json \
./packages/api

COPY \
./packages/common/package.json \
./packages/common

RUN npm ci

# ========== building =======================

COPY \
./tsconfig.json \
.

COPY \
./packages/common/tsconfig.json \
./packages/common
COPY \
./packages/common/src \
./packages/common/src

COPY \
./packages/api/tsconfig.json \
./packages/api
COPY \
./packages/api/src \
./packages/api/src

RUN true\
&& cd ./packages/common \
&& npm run build \
&& cd ../api \
&& npm run build \
&& true

COPY \
./packages/api/migrations \
./packages/api/migrations

# ========== running =======================

CMD [ "node", "./packages/api/dist/index.js" ]
