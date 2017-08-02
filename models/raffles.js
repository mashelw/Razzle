var db = require("../models")

module.exports = function(sequelize,DataTypes) {

    var raffles = sequelize.define("raffles" , {
      item: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      link: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      itemPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      },
      totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
      },
      purchasedTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      },
      ticketPrice:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: function(){
          db.raffles.findOne({where: {id: (id)}}).then(function(response){
            return (response.itemPrice / response.totalTickets)
            })
         }  
      },
      won: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      },
      winner: {
        type: DataTypes.INTEGER,
      },
  },{timestamps: false}) 

  raffles.associate = function(models){

      raffles.hasMany(models.tickets,{
        onDelete: "cascade"
      })
  }
  return raffles  
};