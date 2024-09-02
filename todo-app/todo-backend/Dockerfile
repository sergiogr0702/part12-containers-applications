FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

EXPOSE 3000

ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database

USER node

CMD npm start