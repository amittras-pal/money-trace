# Stage 1: Build the application
FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code and copy non-TS assets
RUN npx tsc && node scripts/copy-assets.js

# --- Production Stage ---
FROM node:22-slim

# Install locale support required by onnxruntime's StringNormalizer
RUN apt-get update && apt-get install -y --no-install-recommends locales \
    && sed -i 's/^# *\(en_US.UTF-8\)/\1/' /etc/locale.gen \
    && locale-gen \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

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
