FROM node:10 AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:10-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

CMD ["npm", "run", "start:prod"]
