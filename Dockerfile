FROM node:14.15

USER node
WORKDIR /home/node/

COPY package.json .
RUN yarn install

COPY . .

EXPOSE 3333

CMD [ "yarn", "start" ]
