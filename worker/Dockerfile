
FROM node:14

ENV PLANNER=http://planners-worker-docker-planner-container-1:3000
ENV MULT=true
ENV ADD=true
ENV PORT=8080
ENV ADDRESS=http://planners-worker-docker-worker-container-1:8080


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "main.mjs"]
