FROM node:latest

WORKDIR /usr/app

COPY package.json ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start:prod" ]