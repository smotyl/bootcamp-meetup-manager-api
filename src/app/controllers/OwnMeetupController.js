const Meetup = require('../models/Meetup');
const User = require('../models/User');
const File = require('../models/File');

class OwnMeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'title', 'description', 'user_id', 'date', 'location'],
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
      ],
    });

    return res.json(meetups);
  }
}

module.exports = new OwnMeetupController();
