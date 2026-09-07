# ---- Build Stage ----
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /umami

# Install build dependencies
RUN apk add --no-cache git libc6-compat

# Clone the exact v1.40.0 tag from the official Umami repository
RUN git clone --depth 1 --branch v1.40.0 https://github.com/umami-software/umami.git .

# Install dependencies using Yarn (required for v1.x)
RUN yarn install --frozen-lockfile

# --- INJECT PATH VARIABLES HERE ---
ENV BASE_PATH=/analytics
ENV DATABASE_TYPE=postgresql

# Rebuild the Next.js bundle with the paths baked in
RUN yarn build

# ---- Runtime Stage ----
FROM node:22-alpine AS runner

WORKDIR /umami

# Create a secure user to run the app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only the compiled production files from the builder stage
COPY --from=builder /umami .

# Expose Next.js default port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
