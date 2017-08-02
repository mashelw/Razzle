var db = require("../models")
var twilio = require('twilio')
var accountSid = 'ACe1fbff8235e3d85a3db46e3f89e5b65d'; // Your Account SID from www.twilio.com/console
var authToken = 'f3d72f6b88ef9990567a65d4701f4d4d';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);

module.exports = function(app){

	app.get("/",function(req,res){

		db.raffles.findAll().then(function(response){

			res.json(response)
		})
	})

	app.post("/api/login",function(req,res){

		db.users.update( {twoFactor:(Math.floor(Math.random() * 900000) + 100000)} , {where: {phone: req.body.phone}} ).then(function(){

			db.users.findOne({where: {phone:req.body.phone}}).then(function(response){

				client.messages.create({
				  	body: response.twoFactor,
				    to: response.phone,  
				    from: '+14159420315' 
				})
			}) 
		})
	})

	app.get("/home",function(req,res){
		
		db.users.findOne({where:{phone:req.body.phone}}).then(function(response){

			if(response.twoFactor === req.body.twoFactor){	

				db.tickets.findAll({include:[db.users]},{where: {phone:req.body.phone}}).then(function(responseTwo){

					res.json(response)
				})
			}
			else{

				res.return("LOLWRONGPASSWORD")

				db.users.update({twoFactor:((Math.floor(Math.random() * 900000) + 100000))},{where: {phone: req.body.phone}}).then(function(responseThree){

					res.redirect("/")
				})
			}
		})
	})

	app.post("/api/purchase",function(req,res){

		db.raffles.findOne({where:{id:req.body.id}}).then(function(response){

			if((response.totalTickets=(response.purchasedTickets+1))&&(!response.won)){

				db.tickets.create({user:req.body.phone},{raffle:{response}}).then(function(responseTwo){

					res.response("YAY YOU BOUGHT THE LAST TICKET HOLY SHIIIIIIIIIT")
					
					db.tickets.findOne(

						{where: {

							id: response.id, 

							number: (Math.ceil(Math.random()))

						}},{include: [db.raffles]}).then(function(responseThree){

						console.log(responseThree.user.phone)

						db.raffles.update({won:true , winner:responseThree.user.phone},{where:{id:response.id}}).then(function(responseFour){
							//TEXT THAT SHIT
							client.messages.create({
						  	body: "OMG YOU WOOOOOON A "+response.item,
						    to: responseThree.user.phone,  
						    from: '+14159420315' 
							})
						})
					})
				})
			}
		
			else if((response.totalTickets>response.purchasedTickets)&&(!response.won)){

				db.tickets.create({user:req.body.phone},{raffle:req.body.name}).then(function(responseTwo){

					res.response("YAY YOU BOUGHT TICKET NUMBER "+responseTwo.number+"THANKS WE SHOULD DISPLAY THIS SOMEWHERE BECAUSE A REDIRECT WILL MAKE THEM LOG IN AGAIN")
				})

				db.raffles.update({purchasedTickets: response.purchasedTickets++},{where:{id:response.id}}).then(function(){})
			}

			else{
				console.log("You managed to bid on a closed raffle. How?!")
			}
		})
	})
}