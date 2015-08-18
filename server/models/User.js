module.exports = function(Sequelize,sequelize){
  var User = sequelize.define('User', 
    {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fullname: {
        field: 'fullname',
        type: Sequelize.STRING(150)
      },
      username: {
        field: 'username',
        type: Sequelize.STRING(100)
      },
      password: {
        field: 'password',
        type: Sequelize.STRING(32)
      }
    },
    {
        tableName: 'users',
        underscored: true
    }
  );
  return User;
};