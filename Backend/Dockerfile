FROM node:20.18-alpine

COPY package.json /app/
COPY Controllers /app/
COPY Lib /app/
COPY Middleware /app/
COPY Models /app/
COPY Routes /app/
COPY .env /app/
COPY Server.js /app/

WORKDIR /app

RUN npm install

CMD ["node", "Server.js"]