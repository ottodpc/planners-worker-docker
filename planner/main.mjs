import dotenv from 'dotenv';
import fetch from 'node-fetch';
import express from 'express';

dotenv.config();

const port = process.env.PORT || 3000;
const nbTasks = parseInt(process.env.TASKS) || 20;

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const taskType = () => (randInt(0, 2) ? 'mult' : 'add');
const args = () => ({ a: randInt(0, 40), b: randInt(0, 40) });

const generateTasks = (i) =>
  new Array(i).fill(1).map((_) => ({ type: taskType(), args: args() }));

let workers = [];

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send(JSON.stringify(workers));
});

app.post('/register', (req, res) => {
  const { url, id } = req.body;
  console.log(`Register: adding ${url} worker: ${id}`);
  workers.push({ url, id });
  res.send('ok');
});

let tasks = generateTasks(nbTasks);
let taskToDo = nbTasks;

const wait = (mili) => new Promise((resolve) => setTimeout(resolve, mili));

const sendTask = async (worker, task) => {
  console.log(`=> ${worker.url}/${task.type}`, task);
  workers = workers.filter((w) => w.id !== worker.id);
  tasks = tasks.filter((t) => t !== task);
  const response = await fetch(`${worker.url}/${task.type}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task.args),
  });

  try {
    const res = await response.json();
    workers = [...workers, worker];
    taskToDo -= 1;
    console.log('---');
    console.log(nbTasks - taskToDo, '/', nbTasks, ':');
    console.log(task, 'has res', res);
    console.log('---');
    return res;
  } catch (err) {
    console.error(task, ' failed', err.message);
    tasks = [...tasks, task];
  }
};

const main = async () => {
  console.log(tasks);
  while (taskToDo > 0) {
    await wait(100);
    if (workers.length === 0 || tasks.length === 0) continue;
    await sendTask(workers[0], tasks[0]);
  }
  console.log('end of tasks');
  server.close();
};

const server = app.listen(port, () => {
  console.log(`Register listening at http://0.0.0.0:${port}`);
  console.log('starting tasks...');
  main();
});
