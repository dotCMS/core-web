FROM node:10.15.3

LABEL com.dotcms.contact "support@dotcms.com"
LABEL com.dotcms.vendor "dotCMS LLC"
LABEL com.dotcms.description "dotCMS Content Management System"

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium

RUN npm i @angular/cli

ENV CHROME_BIN=chromium

COPY package*.json ./

RUN npm install

COPY . .

CMD ng build dotcms-js
COPY /dist-lib/dotcms-js ./dist-lib/dotcms-js

CMD ng build dot-layout-grid
COPY /dist-lib/dot-layout-grid ./dist-lib/dot-layout-grid