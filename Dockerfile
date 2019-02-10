FROM node:10
RUN mkdir app
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g nodemon








