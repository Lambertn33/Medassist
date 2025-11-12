FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Expose Vite dev server port
EXPOSE 5173

# Default command (can be overridden by docker-compose)
# Note: We install deps in the container since volumes might override node_modules
CMD ["sh", "-c", "npm ci && npm run dev"]

