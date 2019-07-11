const Yup = require('yup');
const { startOfHour, isBefore } = require('date-fns');

const Meetup = require('../models/Meetup');
const User = require('../models/User');
const File = require('../models/File');

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const meetups = await Meetup.findAll({
      where: { canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'title',
        'description',
        'user_id',
        'date',
        'location',
        'canceled_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { title, description, location, date } = req.body;

    const hourStart = startOfHour(date);
    const isPastDate = isBefore(hourStart, new Date());

    if (isPastDate) {
      return res.status(400).json({ error: 'Date cant be in the past' });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({ error: 'Can only edit your own meetup' });
    }

    const {
      title,
      description,
      location,
      date,
      banner_id,
    } = await meetup.update(req.body);

    return res.json({
      title,
      description,
      location,
      date,
      banner_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Cant cancel not your meetup',
      });
    }

    meetup.canceled_at = new Date();

    await meetup.save();

    return res.json(meetup);
  }
}

module.exports = new MeetupController();
