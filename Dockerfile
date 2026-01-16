# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN npx tsc

# Copy non-TypeScript assets to build directory as they are not automatically copied by tsc
# Using checks to prevent failure if these directories don't exist
RUN [ -d src/data ] && cp -r src/data build/ || true
RUN [ -d src/assets ] && cp -r src/assets build/ || true

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prod.js ./prod.js

# Expose the port
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "start" ]
