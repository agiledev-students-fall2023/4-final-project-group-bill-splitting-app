FROM node:16
WORKDIR /usr/src/app
# install dependencies into the image - doing this first will speed up subsequent builds, as Docker will cache this step
COPY package*.json ./
RUN npm install
# copy the remaining app source code into the default directory within the image
COPY . .
# expose port 3001 to make it available to the docker daemon
EXPOSE 3001
# define the runtime command that will be executed when a container is made from the image
CMD [ "node", "server.js" ]