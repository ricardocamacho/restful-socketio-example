module.exports = function(User, Post){
  return {
    findAll: function(req, res) {
      User.findAll({
        include: [
           { model: Post }
        ]
      }).then(function(users) {
        return res.json(users);
      });
    },
    findOne: function(req, res) {
      User.findOne({
        where: { id: req.params.id },
        include: [
           { model: Post }
        ]
      }).then(function(user) {
        if(user){
          return res.json(user);
        }else{
          return res.json({ message: 'User was not found' });
        }
      });
    },
    create: function(req, res) {
      var data = req.body;
      if(data.hasOwnProperty('fullname') && data.hasOwnProperty('username') && data.hasOwnProperty('password')){
        data.password = crypto.createHash('md5').update(data.password).digest('hex');
        User.create(data).then(function(){
          return res.json({ message: 'User created'});
        });
      }else{
        return res.json({ message: 'Missing parameters' });
      }
    },
    update: function(req, res) {
      var data = req.body;
      if(data.hasOwnProperty('fullname') && data.hasOwnProperty('username') && data.hasOwnProperty('password')){
        data.password = crypto.createHash('md5').update(data.password).digest('hex');
        User.update(data, {
          where: {
            id: req.params.id
          }
        }).then(function(){
          return res.json({ message: 'User updated'});
        });
      }else{
        return res.json({ message: 'Missing parameters' });
      }
    },
    delete: function(req, res) {
      User.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(){
        return res.json({ message: 'User deleted'});
      });
    }
  }
};