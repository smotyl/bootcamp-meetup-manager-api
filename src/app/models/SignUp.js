const Sequelize = require('sequelize');

class SignUp extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {},
      {
        freezeTableName: true,
        tableName: 'users_meetups',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
  }
}

module.exports = SignUp;
