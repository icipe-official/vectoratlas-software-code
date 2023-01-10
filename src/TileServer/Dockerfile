FROM maptiler/tileserver-gl:v4.1.2
USER root:root
RUN apt-get update \
  && apt-get install -y inotify-tools \
  && rm -rf /var/lib/apt/lists/*

COPY ./watchAndStartTileserver.sh /usr/src/app/
COPY ./watchForTrigger.sh /usr/src/app/

RUN chmod +x /usr/src/app/watchAndStartTileserver.sh && chmod +x /usr/src/app/watchForTrigger.sh

USER node:node
ENTRYPOINT ["/usr/src/app/watchAndStartTileserver.sh"]