FROM node:18 as build

# Set timezone cho build stage
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear cache và install
RUN npm cache clean --force
RUN rm -f package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build với timezone environment
ENV REACT_APP_TIMEZONE=Asia/Ho_Chi_Minh
RUN npm run build

# Production stage
FROM nginx:alpine

# Set timezone cho production stage
ENV TZ=Asia/Ho_Chi_Minh
RUN apk add --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]