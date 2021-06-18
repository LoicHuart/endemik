FROM node:16

COPY package*.json .

RUN yarn
RUN yarn cache clean --force

EXPOSE 3001

RUN mkdir app

WORKDIR /app

CMD [ "node", "index.js" ]