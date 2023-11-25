
FROM node:14

ENV PORT 3000
ENV TASKS 4


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "main.mjs"]
