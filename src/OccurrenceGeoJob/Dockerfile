FROM ubuntu:24.04 as builder

# Avoid interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl git tar build-essential libssl-dev python3 python3-pip python3-venv && \
  rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -m -d /home/app app

USER app
WORKDIR /home/app/app

# Install nvm & Node.js
ENV NVM_DIR=/home/app/.nvm
ENV NODE_VERSION=20.19.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash \
  && . "$NVM_DIR/nvm.sh" \
  && nvm install ${NODE_VERSION} \
  && nvm alias default ${NODE_VERSION} \
  && nvm use default

ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Copy project files
COPY --chown=app:app . .

# Install just
RUN sh justw --version
ENV PATH=/home/app/app/.just:$PATH

# Install dependencies and build
RUN just npm-ci
RUN just npm-build

FROM ubuntu:24.04 as runner

# Avoid interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install runtime dependencies only (no build-essential needed)
RUN apt-get update && apt-get install -y \
  curl git libssl-dev python3 python3-pip python3-venv && \
  rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -m -d /home/app app

USER app
WORKDIR /home/app/app

# Install Node.js
ENV NVM_DIR=/home/app/.nvm
ENV NODE_VERSION=20.19.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash \
  && . "$NVM_DIR/nvm.sh" \
  && nvm install ${NODE_VERSION} \
  && nvm alias default ${NODE_VERSION} \
  && nvm use default

ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Copy built artifacts, dependencies, and runtime files from builder
COPY --from=builder --chown=app:app /home/app/app/dist ./dist
COPY --from=builder --chown=app:app /home/app/app/node_modules ./node_modules
COPY --from=builder --chown=app:app /home/app/app/package.json .
COPY --from=builder --chown=app:app /home/app/app/package-lock.json .
COPY --from=builder --chown=app:app /home/app/app/.just ./.just
COPY --from=builder --chown=app:app /home/app/app/justfile ./justfile
COPY --from=builder --chown=app:app /home/app/app/file-paths.config.json ./file-paths.config.json

COPY --chown=app:app entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh 

COPY --chown=app:app sql/ sql/
ENV SQL_QUERIES_FOLDER=/home/app/app/sql
ENV FILE_PATHS_CONFIG=/home/app/app/file-paths.config.json

# Set PATH to include just
ENV PATH=/home/app/app/.just:$PATH

ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "just", "node-start" ]


