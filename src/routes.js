const { Router } = require('express');
const multer = require('multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const MeetupController = require('./app/controllers/MeetupController');
const OwnMeetupController = require('./app/controllers/OwnMeetupController');
const SignUpController = require('./app/controllers/SignUpController');

const multerFiles = require('./config/multer');

const upload = multer(multerFiles);

const routes = new Router();

const authMiddleware = require('./app/middlewares/auth');

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/meetups/owner', OwnMeetupController.index);

routes.get('/meetups/signup', SignUpController.index);
routes.post('/meetups/signup/:id', SignUpController.store);

module.exports = routes;
