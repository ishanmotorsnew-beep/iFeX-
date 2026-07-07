# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server files
COPY server/ ./server/
COPY public/ ./public/
COPY data/ ./data/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server-combined.js"]
