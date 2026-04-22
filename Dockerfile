# Build Stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies including devDeps for the build
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim
WORKDIR /app

# Install python3 and build-essential in case sqlite3 needs a rebuild
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Install only production dependencies
RUN npm install --production

# Expose the Health Check port
EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/index.js"]
