FROM node:10.15.3

LABEL com.dotcms.contact "support@dotcms.com"
LABEL com.dotcms.vendor "dotCMS LLC"
LABEL com.dotcms.description "dotCMS Content Management System"

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium
ENV CHROME_BIN=chromium

RUN npm i -g @angular/cli@7.1.4

COPY . .

RUN npm install

RUN ng build dotcms-js
RUN ng build dot-layout-grid