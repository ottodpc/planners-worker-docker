
FROM node:14

ENV PLANNER=http://planners-worker-docker-planner-container-1:3000
ENV MULT=true
ENV ADD=true
ENV PORT=8080
ARG SPECIALIZATION
ENV SPECIALIZATION_ENV $SPECIALIZATION
ENV TOTAL_INSTANCES=30


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "main.mjs"]