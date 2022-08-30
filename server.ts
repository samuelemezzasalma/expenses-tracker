import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import LocalStrategy from "passport-local"
import path from "path";
import process from "process";
import config from "./config";
import User from "./models/user";
import authRoutes from "./routes/auth";
import transactionsRoutes from "./routes/transactions";

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
  await mongoose.connect(config.mongoURI, {}).then(() => {
    console.log('MongoDb database is connected');
  }).catch((err: Error) => console.log(err))
} else {  
  throw new Error('No mongoURI')
}

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'this is my secret',
  store: MongoStore.create({ client: mongoose.connection.getClient() })
}))

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(passport.initialize())
app.use(passport.session())

authRoutes


// app.use('/api/transactions', transactionRoutes)

app.use('/api/transactions', transactionsRoutes)
app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html')))
}

/**
 * Listen to incoming requests on port
 */
app.listen(config.port, () => console.log('Express is running on port ' + config.port))
