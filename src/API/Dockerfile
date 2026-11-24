# Build context is the `src/` directory (workflows build with
#   docker build -f src/API/Dockerfile src
# ) so that the OccurrenceGeoJob can be embedded in the same image: the API
# spawns `node $OCC_GEO_JOB_DIR/dist/index.js` as an awaited CLI child process
# to regenerate the full occurrence data files.

# --- OccurrenceGeoJob builder (produces dist/) ---
FROM node:22 AS geojob-builder
WORKDIR /usr/src/geojob
COPY OccurrenceGeoJob/package*.json ./
RUN npm ci --verbose
COPY OccurrenceGeoJob/ ./
RUN npm run build

# --- API builder ---
FROM node:22 AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY API/package*.json ./
# Install app dependencies
RUN npm ci --verbose
# Bundle app source
COPY API/ ./
# Creates a "dist" folder with the production build
RUN npm run build

FROM node:22 AS runner

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

# Embed the OccurrenceGeoJob at OCC_GEO_JOB_DIR (dist + sql + runtime deps).
# The API spawns it as a CLI child process to regenerate the full occurrence
# data files served from FULL_OCCURRENCE_DATA_FOLDER.
ENV OCC_GEO_JOB_DIR=/usr/src/OccurrenceGeoJob
RUN mkdir -p /usr/src/OccurrenceGeoJob
COPY --from=geojob-builder /usr/src/geojob/dist /usr/src/OccurrenceGeoJob/dist
COPY --from=geojob-builder /usr/src/geojob/sql /usr/src/OccurrenceGeoJob/sql
COPY --from=geojob-builder /usr/src/geojob/package*.json /usr/src/OccurrenceGeoJob/
RUN cd /usr/src/OccurrenceGeoJob && npm ci --omit=dev --verbose

# Copy application files and install production dependencies
WORKDIR /usr/src/app
COPY API/package*.json ./
RUN npm ci --omit=dev --verbose

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/transformGeotiff.sh .

COPY API/public/version.txt /usr/src/app/version.txt
# Copy the entrypoint script and make it executable
COPY API/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


RUN chmod +x ./transformGeotiff.sh
COPY --from=builder /usr/src/app/colormap.txt .

ENTRYPOINT ["/entrypoint.sh"]
# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]
