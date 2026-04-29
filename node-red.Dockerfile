FROM nodered/node-red:latest

USER root

COPY node-red-data/package*.json /data/
RUN chown -R node-red:node-red /data

USER node-red
RUN cd /data && npm install --omit=dev

COPY --chown=node-red:node-red node-red-data/ /data/

ENV FLOWS=flows.json
WORKDIR /usr/src/node-red
