const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const urlModels = require('./models/url.js');
mongoose.connect('mongodb://mickeyvai:Jobayer29@ds235251.mlab.com:35251/freecodecamp-url-shortener');
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // "*" for public access and www.example.com for specific uses
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.get('/url/:shortURL(*)', (req, res, next) => {
	let mainUrl = req.params.shortURL;
	const url_validator = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

	if (url_validator.test(mainUrl) === true) {
		let number = Math.floor(Math.random()*40)+1;
		const getRandomString = (len, an) =>{
	    	an = an&&an.toLowerCase();
	    	let str="", i=0, min=an=="a"?10:0, max=an=="n"?10:62;
	    	for(;i++<len;){
	      		let r = Math.random()*(max-min)+min <<0;
	      		str += String.fromCharCode(r+=r>9?r<36?55:61:48);
	    	}
	    	return str;
		}
		let data = new urlModels (
			{
				original_url: mainUrl,
				shortner_url: getRandomString(number, 'A')
			}
		);
		
		data.save((err) => {
			if (err) {
				return res.send('Error');
			}
		});
		
		return res.json({
			original_url: data.original_url,
			short_url: data.shortner_url
		});
	}
	let data = new urlModels({
		original_url: mainUrl,
		shortner_url: 'InvalidURL'
	})
	return res.json(data);
})

app.get('/:redirectURL', (req, res, next) => {
	let redirectUrl = req.params.redirectURL, url_validator = /(http(s?))\:\/\//gi;
	
	urlModels.findOne({'shortner_url': redirectUrl}, (error, respond) => {
		if (error) {
			return res.send('Error reading Database')
		}
		if (url_validator.test(respond.original_url)) {
			res.redirect(301, respond.original_url)
		} else {
			res.redirect(301, `http://${respond.original_url}`);
		}
	})

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App is listen on port ${PORT}`);
})