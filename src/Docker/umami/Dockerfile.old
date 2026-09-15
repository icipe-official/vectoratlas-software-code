# Use Node 22 Alpine as base
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /umami

# Install minimal build dependencies
RUN apk add --no-cache git libc6-compat

# Copy package.json and yarn.lock from your analytics app folder
COPY ../analytics/package.json ../analytics/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app source code
COPY ../analytics ./

# Build your app if needed (example)
RUN yarn build

# ---- Runtime stage ----
FROM node:22-alpine AS runner

# Create app directory
WORKDIR /umami

# Create a user to run the app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /umami .

# Expose port (example: 3000)
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
