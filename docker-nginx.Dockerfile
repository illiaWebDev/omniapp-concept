FROM node:18-alpine as builder


WORKDIR /usr/src/app

# ========== dependencies for build ==================

COPY \
package*.json \
.

RUN true \
&& mkdir -p ./packages/front/public \
&& mkdir -p ./packages/common \
&& true

COPY \
./packages/front/package.json \
./packages/front

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
./packages/front/tsconfig.json \
./packages/front/webpack.config.js \
./packages/front/webpack.config.sw.js \
./packages/front/index.html \
./packages/front/


COPY \
./packages/front/src \
./packages/front/src

ARG NODE_ENV
ARG API_URL_FROM_BROWSER

RUN true\
&& cd ./packages/common \
&& npm run build \
&& cd ../front \
&& npm run build \
&& true


# # ========== move artifacts to nginx image =======================


FROM nginx:latest


ARG API_PORT
ARG NGINX_SERVER_NAME


COPY \
./packages/front/public/icons \
/www/public/icons/
COPY \
./packages/front/public/tinymce \
/www/public/tinymce/

COPY \
./packages/front/public/bootstrap_5_3_0.js \
./packages/front/public/bootstrapSolar.min.css \
./packages/front/public/app.webmanifest \
./packages/front/public/fontAwesome.js \
./packages/front/public/styles.css \
/www/public/

COPY ./nginx/nginx.conf /etc/nginx

COPY --from=builder \
/usr/src/app/packages/front/public/index.html \
/usr/src/app/packages/front/public/main.js \
/usr/src/app/packages/front/public/sw.js \
/usr/src/app/packages/front/public/vendors.js \
/www/public/


RUN true  \
&& envsubst '${API_PORT} ${NGINX_SERVER_NAME}' < /etc/nginx/nginx.conf > /etc/nginx/nginx2.conf \
&& rm /etc/nginx/nginx.conf \
&& mv /etc/nginx/nginx2.conf /etc/nginx/nginx.conf \
&& true
