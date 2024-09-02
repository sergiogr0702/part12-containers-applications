FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV DEBUG=playground:*

CMD [ "npm", "run", "dev" ]