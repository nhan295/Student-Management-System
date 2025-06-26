# frontend/Dockerfile
FROM node:18 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear cache và xóa lock file, sau đó install lại
RUN npm cache clean --force
RUN rm -f package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]