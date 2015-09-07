module.exports = function(User, Post, crypto){
  return {
    findAll: function(req, res) {
      User.findAll({
				attributes: ['id', 'fullname', 'username'],
        include: [{ model: Post, attributes: ['id', 'body'] }]
      }).then(function(users) {
        return res.status(200).send({ success: true, data: users });
      });
    },
    findOne: function(req, res) {
			req.params.id = parseInt(req.params.id);
			if(Number.isInteger(req.params.id)){
				User.findOne({
					attributes: ['id', 'fullname', 'username'],
					where: { id: req.params.id },
					include: [{ model: Post, attributes: ['id', 'body'] }]
				}).then(function(user) {
					if(user){
						return res.status(200).send({ success: true, data: user });
					}else{
						return res.status(404).send({ success: false, message: 'User was not found' });
					}
				});
			}else{
				return res.status(400).send({ success: false, message: 'User ID must be an integer' });
			}
    },
    create: function(req, res) {
      var data = req.body;
      if(data.hasOwnProperty('fullname') && data.hasOwnProperty('username') && data.hasOwnProperty('password')){
        data.password = crypto.createHash('md5').update(data.password).digest('hex');
        User.create(data).then(function(){
          return res.status(200).send({ success: true, message: 'User created'});
        });
      }else{
        return res.status(400).send({ success: false, message: 'Missing parameters' });
      }
    },
    update: function(req, res) {
			req.params.id = parseInt(req.params.id);
			if(Number.isInteger(req.params.id)){
				var data = req.body;
				if(data.hasOwnProperty('fullname') && data.hasOwnProperty('username') && data.hasOwnProperty('password')){
					data.password = crypto.createHash('md5').update(data.password).digest('hex');
					User.update(data, { where: { id: req.params.id } }).then(function(){
						return res.status(200).send({ success: true, message: 'User updated'});
					});
				}else{
					return res.status(400).send({ success: false, message: 'Missing parameters' });
				}
			}else{
				return res.status(400).send({ success: false, message: 'User ID must be an integer' });
			}
    },
    delete: function(req, res) {
			req.params.id = parseInt(req.params.id);
			if(Number.isInteger(req.params.id)){
				User.destroy({ where: { id: req.params.id } }).then(function(){
					return res.json({ success: true, message: 'User deleted'});
				});
			}else{
				return res.status(400).send({ success: false, message: 'User ID must be an integer' });
			}
    }
  }
};