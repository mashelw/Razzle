module.exports = function(sequelize,DataTypes) {

    var raffles = sequelize.define("raffles" , {
      item: {
      type: DataTypes.STRING,
      allowNull: false
      },
      link: {
      type: DataTypes.STRING,
      allowNull: false
      },
      itemPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      purchasedTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
      },
      ticketPrice:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: ((itemPrice*1.1)/totalTickets)
      },
      won: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    } 
  },{timestamps: false}) 

  raffles.associate = function(models){

      raffles.hasMany(models.tickets,{
        onDelete: "cascade"
      })
  }
  return raffles  
};