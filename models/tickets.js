var db = require("../models")

module.exports = function(sequelize,DataTypes) {

    var tickets = sequelize.define("tickets" , {
      number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: function(){
        db.raffles.findOne({include:[db.tickets]}).then(function(response){
            return response.purchasedTickets
          })
      }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: function(){
          db.raffles.findOne({include:[db.tickets]}).then(function(response){
            return response.ticketPrice
          })
        }
      } 
  },{timestamps: false}) 

  tickets.associate = function(models){
    tickets.belongsTo(models.users, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  tickets.associate = function(models){
    tickets.belongsTo(models.raffles ,{
      foreignKey: {
        allowNull: false
      }
    })
  }
  return tickets;  
};