# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 5173

# Start React in development mode with Vite
CMD ["npm", "run", "dev"]
