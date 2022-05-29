const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const { getConfig } = require('./config');
const { contactsController } = require('./resources/contacts/contacts.controller');
const { UsersController } = require('./resources/users/users.controller');
const { FilesController } = require('./resources/files/files.controller');


class UsersServer {

  constructor() {
    this.app = null;
    this.config = null;
  }

  async start() {
    this.initServer();
    this.initConfig();
    await this.initDatabase();
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

  async initDatabase() {
    try {
      await mongoose.connect(this.config.database.url);
      console.log("Database connection successful");
    } catch (err) {
      console.log('Database connection error', err);
      process.exit(1);
    }
  }

  initMiddlewares() {
    const formatsLogger = this.app.get('env') === 'development' ? 'dev' : 'short';
    this.app.use(logger(formatsLogger));
    this.app.use(cors());
    this.app.use(express.json());
  }

  initRoutes() {
    this.app.use('/api/contacts', contactsController);
    this.app.use('/api/users', UsersController);
    this.app.use('/avatars', FilesController);
  }

  initError() {
    this.app.use((err, req, res, next) => {
      const statusCode = err.status || 500;
      if (statusCode >= 500) {
        res.status(statusCode).json({ message: err.message })
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

