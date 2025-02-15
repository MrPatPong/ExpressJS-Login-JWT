const express = require('express')

const morgan = require('morgan')
const cors = require('cors')
const bodyParse = require('body-parser')
const redis = require('redis');
const connectDB = require('./Config/db')
const dotenv = require('dotenv')
// const { PrismaClient } = require("@prisma/client");
const { PrismaClient: PostgresPrisma } = require('./prisma/generated/postgres');
const { PrismaClient: MongoPrisma } = require('./prisma/generated/mongodb');

dotenv.config();

// const prisma = new PrismaClient()
const postgresPrisma = new PostgresPrisma();
const mongoPrisma = new MongoPrisma();

const PORT = process.env.PORT
const { readdirSync } = require('fs')
// const productRouters = require('./Routes/product')
// const authRouters = require('./Routes/auth')

const app = express();

connectDB()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParse.json({ limit: '10mb' }))

// Route 1
// app.get('/product', (req, res) => {
//     res.send('Hello Endpoint 555')
// })

// Route 2
// app.use('/api', productRouters)
// app.use('/api', authRouters)

// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Example: Set and Get a value
client.set('key', 'value', redis.print);
client.get('key', (err, reply) => {
  console.log('GET key:', reply);
});

app.get("/users0", async (req, res) => {
    const users = await postgresPrisma.user.findMany();
    res.json(users);
  });
  
app.post("/users0", async (req, res) => {
    const { email, name } = req.body;

    try {
      const user = await postgresPrisma.user.create({
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
        console.log(error)
      res.status(400).json({ error: error.message });   
    }
  });

  app.get("/users1", async (req, res) => {
    const users = await mongoPrisma.user.findMany();
    res.json(users);
  });
  
app.post("/users1", async (req, res) => {
    const { email, name } = req.body;

    try {
      const user = await mongoPrisma.user.create({
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
        console.log(error)
      res.status(400).json({ error: error.message });   
    }
  });

// Route 3
readdirSync('./Routes')
    .map((r) => app.use('/api', require('./Routes/' + r)))


app.listen(PORT, () => console.log('Server is Running port 3000'))