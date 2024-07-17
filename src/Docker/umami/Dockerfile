# Use Node.js 18 as the base image for dependencies installation
FROM node:18-alpine AS deps

RUN apk add --no-cache git
RUN git clone https://github.com/umami-software/umami.git
RUN apk add --no-cache libc6-compat
WORKDIR /umami
RUN yarn install --frozen-lockfile
# Rebuild the source code only when needed
FROM node:18 AS builder
WORKDIR /umami
COPY --from=deps /umami .
ENV DATABASE_TYPE postgresql
ENV BASE_PATH /analytics
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build-docker
# Production image, copy all the files and run next
FROM node:18 AS runner
WORKDIR /umami
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install all dependencies, including npm-run-all, dotenv, and prisma
RUN yarn install --production --frozen-lockfile && yarn add npm-run-all dotenv prisma --network-concurrency 1

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /umami/next.config.js .
COPY --from=builder --chown=nextjs:nodejs /umami/public ./public
COPY --from=builder /umami/package.json ./package.json
COPY --from=builder /umami/prisma ./prisma
COPY --from=builder /umami/scripts ./scripts
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /umami/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /umami/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["yarn", "start-docker"]
