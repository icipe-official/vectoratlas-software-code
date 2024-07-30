# Use Node.js 18 as the base image
FROM node:18.16.0 AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install app dependencies
RUN npm ci
# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN npm run build

FROM node:18.16.0 AS runner

# Set up the working directory
WORKDIR /usr/src/app

# Ensure directory for downloads exists
RUN mkdir -p /usr/src/app/public/downloads

# Set environment to production
ENV NODE_ENV production

# Install dependencies for tippecanoe and gdal
RUN apt-get update \
  && apt-get install -y unzip gdal-bin make g++ libsqlite3-dev libz-dev libpcap-dev git

# Clone and build tippecanoe
RUN git clone --depth=1 https://github.com/mapbox/tippecanoe.git /usr/src/tippecanoe \
  && cd /usr/src/tippecanoe \
  && make \
  && make install \
  && cd /usr/src \
  && rm -rf /usr/src/tippecanoe

# Clean up unnecessary packages
RUN apt-get remove -y git g++ make libsqlite3-dev \
  && apt-get autoremove -y \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy application files and install production dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --frozen-lockfile

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/transformGeotiff.sh .
RUN chmod +x ./transformGeotiff.sh
COPY --from=builder /usr/src/app/colormap.txt .
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
