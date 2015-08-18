module.exports = function(User, Post, io){
  return {
    findAll: function(req, res) {
      Post.findAll({
        include: [
           { model: User }
        ]
      }).then(function(posts) {
        return res.json(posts);
      });
    },
    findOne: function(req, res) {
      Post.findOne({
        where: { id: req.params.id },
        include: [
           { model: User }
        ]
      }).then(function(post) {
        if(post){
          return res.json(post);
        }else{
          return res.json({ message: 'Post was not found' });
        }
      });
    },
    create: function(req, res) {
      var data = req.body;
      if(data.hasOwnProperty('body') && data.hasOwnProperty('user_id')){
        User.count({ where: ["id = ?", data.user_id] }).then(function(c) {
          if(c == 1){
            Post.create(data).then(function(dbres){
              data.created_at = dbres.dataValues.created_at;
              io.emit('chat message', data);
              return res.json({ message: 'Post created'});
            });
          }else{
            return res.json({ message: 'The user does not exists'});
          }
        });
      }else{
        return res.json({ message: 'Missing parameters' });
      }
    }
  }
};