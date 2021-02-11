FROM node:14-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install --silent
COPY . .
CMD [ "npm", "start" ]
EXPOSE 3000
