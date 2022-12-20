# Base image
FROM node:16.16.0-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

FROM node:16.16.0-alpine AS runner
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/public/downloads

ENV NODE_ENV production

# install tippecanoe and gdal for transforming layers
WORKDIR /usr/src/tippecanoe
RUN apk add --no-cache git g++ make libgcc libstdc++ sqlite-libs sqlite-dev zlib-dev bash gdal unzip \
  && git clone https://github.com/mapbox/tippecanoe.git \
  && cd tippecanoe \
  && make \
  && make install \
  && cd .. \
  && rm -rf tippecanoe \
  && apk del git g++ make sqlite-dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]