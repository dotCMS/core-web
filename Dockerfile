FROM node:10.15.3

LABEL com.dotcms.contact "support@dotcms.com"
LABEL com.dotcms.vendor "dotCMS LLC"
LABEL com.dotcms.description "dotCMS Content Management System"

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium
ENV CHROME_BIN=chromium

RUN npm i -g @angular/cli@7.1.4

COPY package.json .
RUN npm i

COPY angular.json .

COPY tsconfig.json .

COPY ./projects/dotcms-js ./projects/dotcms-js  
RUN ng build dotcms-js

COPY ./projects/dot-layout-grid ./projects/dot-layout-grid 
RUN ng build dot-layout-grid

COPY karma.conf.js .

COPY ./projects/dot-rules ./projects/dot-rules 

COPY ./src ./src

COPY ./docker/storage.sh ./storage.sh
RUN chmod 500 ./storage.sh

COPY ./docker/run_and_storage.sh ./run_and_storage.sh
RUN chmod 500 ./run_and_storage.sh