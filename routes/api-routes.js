var db = require("../models")

module.exports = function(app){

	app.get("/",function(req,res){
		db.raffles.findAll().then(function(response){
			res.json(response)
		})
	})

	app.post("/api/login",function(req,res){
		db.users.update({{twoFactor:{((Math.floor(Math.random() * 900000) + 100000))}}{where: {number: req.body.number}}}).then(function(response){
			// INSERT TEXTING MAGIC HERE and res.json the auth handlebars page
		})
	})

	app.get("/home",function(req,res){
		db.users.findOne({where:{number:req.body.number}}).then(function(response){
			if(response.twoFactor === req.body.twoFactor){	
				db.tickets.findAll({{include:[db.users]},{where: {number:{req.body.number}}}}).then(function(response){
					res.json(response)
				})
			}
			else{
				res.return("LOLWRONGPASSWORD")
				db.users.update({{twoFactor:{((Math.floor(Math.random() * 900000) + 100000))}}{where: {number: req.body.number}}}).then(function(response){
					res.redirect("/")
				})
			}
		})
	})
}