# Build Stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --production

# Expose the Health Check port
EXPOSE 8080

# Set environment variables (Override these in your hosting dashboard)
ENV PORT=8080

CMD ["node", "dist/index.js"]
