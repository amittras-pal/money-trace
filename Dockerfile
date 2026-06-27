# Stage 1: Build the application
FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Fetch the latest ML model bundle from GitHub Releases
RUN curl -fsSL -o model_bundle.tar.gz https://github.com/amittras-pal/money-trace/releases/latest/download/model_bundle.tar.gz \
    && mkdir -p src/ml-models \
    && tar -xzvf model_bundle.tar.gz -C src/ml-models/ \
    && rm model_bundle.tar.gz

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

# Install only production dependencies, then prune unused onnxruntime-node
# platform binaries to reduce image size (~500 MB savings).
# Dynamically detects the build platform's OS and arch to keep only what's needed.
RUN npm install --only=production \
    && CURRENT_OS="linux" \
    && CURRENT_ARCH=$(dpkg --print-architecture | sed 's/amd64/x64/' | sed 's/arm64/arm64/') \
    && ONNX_BIN="node_modules/onnxruntime-node/bin/napi-v6" \
    && if [ -d "$ONNX_BIN" ]; then \
         find "$ONNX_BIN" -mindepth 1 -maxdepth 1 -type d ! -name "$CURRENT_OS" -exec rm -rf {} + \
         && find "$ONNX_BIN/$CURRENT_OS" -mindepth 1 -maxdepth 1 -type d ! -name "$CURRENT_ARCH" -exec rm -rf {} + ; \
       fi

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prod.js ./prod.js

# Expose the port
EXPOSE 3000

# Define the command to run your app
CMD [ "npm", "start" ]
