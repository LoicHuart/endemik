FROM node:16

RUN mkdir /app

COPY ./ /app

WORKDIR /app

RUN npm install -g nodemon
RUN npm install -g dotenv
RUN npm install 
RUN npm cache clean --force

EXPOSE 3000

CMD ["nodemon","index.js"]

