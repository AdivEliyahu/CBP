FROM node:18 as build

WORKDIR /client

COPY . .

RUN npm install

FROM node:18-alpine as main

WORKDIR /client

COPY --from=build /client .

EXPOSE 3000

CMD ["npm", "start"]