FROM node:latest as build-stage
WORKDIR /app
# install dependencies into the image - doing this first will speed up subsequent builds, as Docker will cache this step
COPY package*.json ./
RUN npm install
# copy the remaining app source code into the default directory within the image
COPY . .
# Build the application
RUN npm run build
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]