module.exports = function(Sequelize,sequelize){
  var Post = sequelize.define('Post', 
    {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      body: {
        field: 'body',
        type: Sequelize.STRING(255)
      },
      user_id: {
        field: 'user_id',
        type: Sequelize.INTEGER/*,
        references: {
          model: User,
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }*/
      }
    },
    {
        tableName: 'posts',
        underscored: true
    }
  );
  return Post;
};