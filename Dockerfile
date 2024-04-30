###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN apk add --no-cache dos2unix
RUN dos2unix entrypoint.sh
RUN dos2unix .docker/logrotate.conf
RUN chmod +x entrypoint.sh

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/entrypoint.sh entrypoint.sh
COPY --chown=node:node --from=development /usr/src/app/.docker/logrotate.conf logrotate.conf

RUN npm run build
ENV NODE_ENV production
ENV HUSKY 0
RUN npm ci --only=production && npm cache clean --force
RUN rm -rf .env*

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

RUN apk add --no-cache dumb-init logrotate gettext

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh entrypoint.sh
COPY --chown=node:node --from=build /usr/src/app/logrotate.conf /etc/application.logrotate.conf.template

ENTRYPOINT ["./entrypoint.sh"]