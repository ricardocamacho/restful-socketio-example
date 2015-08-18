var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var Sequelize = require('./server/models/Connection').Sequelize;
var sequelize = require('./server/models/Connection').sequelize;

var User = require('./server/models/User')(Sequelize,sequelize);
var Post = require('./server/models/Post')(Sequelize,sequelize);

User.hasMany(Post);
Post.belongsTo(User);

var app = express();

app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.server = http.createServer(app);
var io = require('socket.io').listen(app.server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the API V1' });
});

var usersCtrl = require('./server/controllers/users')(User, Post);
var postsCtrl = require('./server/controllers/posts')(User, Post, io);

/* USERS */
router.get('/users', usersCtrl.findAll);
router.get('/users/:id', usersCtrl.findOne);
router.post('/users', usersCtrl.create);
router.put('/users/:id', usersCtrl.update);
router.delete('/users/:id', usersCtrl.delete);
/* END USERS */

/* POSTS */
router.get('/posts', postsCtrl.findAll);
router.get('/posts/:id', postsCtrl.findOne);
router.post('/posts', postsCtrl.create);
/*router.put('/posts/:id', postsCtrl.update);
router.delete('/posts/:id', postsCtrl.delete);*/
/* END POSTS */

app.use('/api', router);

app.server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});