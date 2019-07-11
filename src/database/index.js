const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User');
const File = require('../app/models/File');
const Meetup = require('../app/models/Meetup');
const SignUp = require('../app/models/SignUp');

const models = [User, File, Meetup, SignUp];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();
