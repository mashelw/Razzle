var db = require("../models")

var accountSid = 'AC2c5124ada28f545c9008ad89b2118b30'; // Your Account SID from www.twilio.com/console
var authToken = 'd65df0edddce2b74a66255a096a2e7ed';   // Your Auth Token from www.twilio.com/console
var client = require('twilio')(accountSid, authToken);

module.exports = function(app){

	app.get("/",function(req,res){
		db.raffles.findAll().then(function(response){
			console.log("THISHITRIGHTHERE")
			res.render("splash", {items: response})
		})
	})

	app.post("/api/login",function(req,res){
		
		console.log(req.body.phone)

		var tired= JSON.stringify(Math.floor(Math.random() * 900000) + 100000)
	

		db.users.upsert({phone: req.body.phone , twoFactor: tired} , {where: {phone: req.body.phone}}).then(function(response){
			console.log("response:"+ JSON.stringify(response))
			

			db.users.findAll({where: {phone:req.body.phone}}).then(function(responseTwo){
				console.log("response two:"+ JSON.stringify(responseTwo))
				console.log(responseTwo[0].twoFactor)
				console.log(responseTwo[0].phone)
				client.messages.create({
				  	body: responseTwo[0].twoFactor,
				    to: "+"+responseTwo[0].phone,  
				    from: '+14152125439' 
				})

			}) 
		})
	})


	app.post("/home",function(req,res){

		console.log("MNERGGGGGG")
		
		db.users.findOne({where:{phone:req.body.phone}}).then(function(response){
			

			if(req.body.twoFactor===response.twoFactor){
				console.log("INITTOWINIT")

			

					res.redirect("/home/")
					
				

				// db.tickets.findAll({include:[db.users]},{where: {phone:req.body.phone}}).then(function(responseTwo){
					
				// 	res.json(response)
				// })
			}
			// else{

			// 	res.return("LOLWRONGPASSWORD")

			// 	db.users.update({twoFactor:((Math.floor(Math.random() * 900000) + 100000))},{where: {phone: req.body.phone}}).then(function(responseThree){

			// 		res.redirect("/")
			// 	})
			// }
		})
	})


	app.get("/home/",function(req,res){
		console.log(req.params.id)
		db.raffles.findAll().then(function(response){
			console.log("INSIDENAOW")
			res.render("home", {items: response})
		})
	})

	app.post("/api/purchase",function(req,res){
		console.log("ERMERGHERD")

		console.log(req.body.item)

		db.raffles.findOne({where:{item:req.body.item}}).then(function(response){

			console.log(response)

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