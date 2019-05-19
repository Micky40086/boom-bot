FROM node:alpine
RUN apk add --update mysql-client && rm -f /var/cache/apk/*
WORKDIR /srv/boom-bot
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn
COPY ./dist ./dist
CMD ["npm", "run", "production"]