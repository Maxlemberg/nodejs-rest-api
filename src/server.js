const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { getConfig } = require('./config');
const { usersController } = require('./resources/user.controller');


class UsersServer {

  constructor() {
    this.app = null;
    this.config = null;
  }

  start() {
    this.initServer();
    this.initConfig();
    this.initMiddlewares();
    this.initRoutes();
    this.initError();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  initConfig() {
    dotenv.config({ path: path.join(__dirname, '../.env') });
    this.config = getConfig();
  }

  initMiddlewares() {
    const formatsLogger = this.app.get('env') === 'development' ? 'dev' : 'short';
    this.app.use(logger(formatsLogger));
    this.app.use(cors());
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use('/api/contacts', usersController)
  }

  initError() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      if (statusCode >= 500) {
        console.log(err);
      }
      res.status(statusCode).json({ message: err.message })
    })
  }

  startListening() {
    this.app.listen(this.config.port, () => {
      console.log(`Server running. Use our API on port: ${this.config.port}`)
    })
  }

}

module.exports.UsersServer = new UsersServer();

