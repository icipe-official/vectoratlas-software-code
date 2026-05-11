FROM ubuntu:20.04

# Avoid interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# 1. Install dependencies
RUN apt-get update && apt-get install -y \
    openssh-server sudo \
    tar git curl wget gzip \
    locales iproute2 \
    build-essential gdb \
    coreutils findutils grep gawk sed util-linux \
    python3 python3-pip \
    software-properties-common \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Setup SSH & User
RUN mkdir -p /var/run/sshd \
    && ssh-keygen -A \
    && echo "PermitEmptyPasswords yes" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# Create dev user with no password and passwordless sudo
RUN useradd -m -s /bin/bash -u 1000 dev \
    && passwd -d dev \
    && echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Switch to the dev user before installing nvm
USER dev

# 3. Install nvm & Node.js
# Based on project troubleshooting docs, Node v16.16.0 is required
ENV NVM_DIR="/home/dev/.nvm"
ENV NODE_VERSION="16.16.0"

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install ${NODE_VERSION} \
    && nvm alias default ${NODE_VERSION} \
    && nvm use default

# Add Node/npm directly to the PATH
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin:${PATH}"

# 4. Final steps
EXPOSE 22

RUN echo 'export NVM_DIR="/home/dev/.nvm"' >> /home/dev/.profile \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/dev/.profile \
    && echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> /home/dev/.profile

WORKDIR /home/dev
CMD ["sudo", "/usr/sbin/sshd", "-D", "-e"]