FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY dist /usr/src/app

EXPOSE 4040

RUN npm install --omit=dev

CMD [ "node", "/usr/src/app/main.js" ]