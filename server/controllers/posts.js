module.exports = function(User, Post, io){
  return {
    findAll: function(req, res) {
      Post.findAll({
				attributes: ['id', 'body', 'created_at'],
				order: 'id DESC',
        include: [{ model: User, attributes: ['id', 'fullname'] }]
      }).then(function(posts) {
        return res.status(200).send({ success: true, data: { posts: posts } });
      });
    },
    findOne: function(req, res) {
			req.params.id = parseInt(req.params.id);
			if(Number.isInteger(req.params.id)){
				Post.findOne({
					where: { id: req.params.id },
					include: [
						 { model: User }
					]
				}).then(function(post) {
					if(post){
						return res.status(200).send({ success: true, data: { post: post } });
					}else{
						return res.status(404).send({ success: false, message: 'Post was not found' });
					}
				});
			}else{
				return res.status(400).send({ success: false, message: 'Post ID must be an integer' });
			}
    },
    create: function(req, res) {
			var data = req.body;
			if(data.hasOwnProperty('body')){
				User.findOne({ where: ["id = ?", req.decoded.user_id] }).then(function(user) {
					if(user){
						data.user_id = user.id;
						Post.create(data).then(function(post){
							data.User = { fullname: user.fullname };
							data.created_at = post.get('created_at');
							io.emit('chat message', data);
							return res.status(200).send({ success: true, message: 'Post created'});
						});
					}else{
						return res.status(404).send({ success: false, message: 'The user does not exist'});
					}
				});
			}else{
				return res.status(400).send({ success: false, message: 'Missing parameters' });
			}
    }
  }
};