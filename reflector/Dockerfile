FROM node:18-alpine

EXPOSE 80
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY reflector/package.json ./
RUN npm install
COPY --chown=node:node reflector/. .
CMD [ "npm", "run", "start" ]
