const { startOfHour, endOfHour, isBefore } = require('date-fns');
const { Op } = require('sequelize');

const SignUp = require('../models/SignUp');
const Meetup = require('../models/Meetup');
const User = require('../models/User');

class SignUpController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!meetup) {
      return res.status(401).json({ error: 'Meetup not found' });
    }

    // usuário não pode se inscrever no próprio meetup
    if (meetup.user_id === req.userId) {
      return res.status(401).json({ error: 'Cant signup your own meetup' });
    }

    // usuário não pode se inscrever duas vezes no mesmo meetup
    const isSigned = await SignUp.findOne({
      where: { user_id: req.userId, meetup_id: req.params.id },
    });

    if (isSigned) {
      return res.status(401).json({ error: 'You are already in this meetup' });
    }

    // usuário não pode se inscrever em um meetup passado
    const isPastDate = isBefore(startOfHour(meetup.date), new Date());

    if (isPastDate) {
      return res.status(401).json({ error: 'Cant signup in past meetups' });
    }

    // usuário não pode se inscrever em dois meetups ao mesmo tempo
    const isSameTime = await SignUp.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.between]: [startOfHour(meetup.date), endOfHour(meetup.date)],
            },
          },
        },
      ],
    });

    if (isSameTime) {
      return res
        .status(401)
        .json({ error: 'Cant signup in two meetups in the same time' });
    }

    const signup = await SignUp.create({
      user_id: req.userId,
      meetup_id: req.params.id,
    });

    return res.json(signup);
  }

  async index(req, res) {
    const meetups = await SignUp.findAll({
      where: { user_id: req.userId },
    });

    return res.json(meetups);
  }
}

module.exports = new SignUpController();
