# Use Node.js 24 official slim image
FROM node:24-slim

# Install Python 3
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
ENV PORT=8080
EXPOSE 8080

# Start your runner
CMD ["node", "server.js"]