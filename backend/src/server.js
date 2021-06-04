import mongoose from 'mongoose';
import express from 'express';

import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import productRouter from './products/index.js';

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use('/products', productRouter);

console.table(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log('Running on port:', port);
    })
  )
  .catch((err) => console.log(err));
