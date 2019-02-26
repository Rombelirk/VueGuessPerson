FROM node:10
RUN mkdir app
WORKDIR /app
COPY . .
RUN npm install -g nodemon
RUN npm install
EXPOSE 3000
CMD [ "nodemon" ]








