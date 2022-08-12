import express from "express";
import mongoose from "mongoose";
import config from "./config";
import cors from "cors";
import morgan from "morgan";
import transactionsRoutes from "./routes/transactions";
import bodyParser from "body-parser";
import process from "process";
import path from "path";

/**
 * Create Express app
 */
 const app = express()

 app.use(cors())
 app.use(bodyParser.json())
 app.use(morgan('tiny'))


/**
 * Connect to Mongo
 */
if (config.mongoURI) {
  mongoose.connect(config.mongoURI, {}).then(() => {
    console.log('MongoDb database is connected');
  }).catch((err: Error) => console.log(err))
} else {
  throw new Error('No mongoURI')
}

// app.use('/api/transactions', transactionRoutes)

app.use('/api/transactions', transactionsRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html')))
}

/**
 * Listen to incoming requests on port
 */
app.listen(config.port, () => console.log('Express is running on port ' + config.port))
