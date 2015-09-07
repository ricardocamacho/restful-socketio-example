var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

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
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Authorization,Content-Type');
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

router.post('/users/session', function(req, res){
	var data = req.body;
	if(data.hasOwnProperty('username') && data.hasOwnProperty('password')){
		data.password = crypto.createHash('md5').update(data.password).digest('hex');
		User.findOne({ where: { username: data.username, password: data.password } }).then(function(user) {
			if(user){
				var token = jwt.sign({ user_id: user.id, username: data.username }, 'secret', {expiresInMinutes: 1});
				return res.status(200).send({ success: true, data: { token: token } });
			}else{
				return res.status(401).send({ success: false, message: 'Invalid username or password' });
			}
		});
	}else{
		return res.status(400).send({ success: false, message: 'Missing parameters' });
	}
});

router.use(function(req, res, next) {
	var authHeader = req.headers['authorization'];
	if(authHeader){
		try{
			var authorization = authHeader.split(' ');
			req.decoded = jwt.verify(authorization[1], 'secret');
			next();
		}catch(err){
			return res.status(401).send({ success: false, message: 'Invalid Token' });
		}
	}else{
		return res.status(400).send({ success: false, message: 'No token provided' });
	}
});

var usersCtrl = require('./server/controllers/users')(User, Post, crypto);
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