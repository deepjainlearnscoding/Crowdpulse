FROM node:18-alpine

WORKDIR /app

# Copy package configurations
COPY server/package*.json ./server/

# Install dependencies
RUN cd server && npm install --production

# Copy the rest of the application
COPY public ./public
COPY server ./server

# Cloud Run injects the PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start the application
WORKDIR /app/server
CMD ["npm", "start"]
