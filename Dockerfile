# Base stage for shared dependencies
FROM node:16.18.0 AS base

# Set a working directory for consistency
WORKDIR /app

# Development stage
FROM base AS development
# Copy only package.json and package-lock.json for efficient caching
COPY package.json package-lock.json ./
# Install all dependencies (including devDependencies)
RUN npm install
# Copy the rest of the application code
COPY . .
# Expose the application port
EXPOSE 4000
# Use nodemon for automatic reloads during development
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
# Copy only package.json and package-lock.json for efficient caching
COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm install --only=production
# Copy the rest of the application code
COPY . .
# Expose the application port
EXPOSE 4000
# Run the application in production mode
CMD ["npm", "run", "start:prod"]
