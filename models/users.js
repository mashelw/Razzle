module.exports = function(sequelize,DataTypes) {

    var users = sequelize.define("users" , {
      phone: {
      type: DataTypes.STRING,
      allowNull: false
      },
      twoFactor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authenticated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    } 
  },{timestamps: false}) 

  users.associate = function(models){

      users.hasMany(models.tickets,{
        onDelete: "cascade"
      })
  }

  return users  
};