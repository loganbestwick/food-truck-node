var express = require('express');
var geoMethods = require('geo-methods');
var geocoder = require('geocoder');
var hbs = require('hbs');
var https = require('https');
var request = require('request');
var async = require("async");
var app = express();
 
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){
	response.render('index');
});

app.get('/search', function(request, response){
	var truckData = '';
	var searchLocation;
	async.series([
			function(callback) {
				geocoder.geocode(request.query.search_address, function(err, data){
					var latitude = data.results[0].geometry.location.lat;
    			var longitude = data.results[0].geometry.location.lng;
    			searchLocation = {"latitude" : latitude, "longitude" : longitude};
    			callback();
				});
			},
			function(callback) {
				var options = {host: 'data.sfgov.org', path: '/resource/rqzj-sfat.json', method: 'GET'};
				https.get(options, function(response){
					response.on('data', function(chunk){
						truckData += chunk;
					});
					response.on('end', function(){
						truckData = JSON.parse(truckData);
						callback();
					})
				})
			},
			function(callback){
				var trucksInRange = geoMethods.compareDistances(truckData, searchLocation, parseFloat(request.query.radius));
				response.send(trucksInRange);
				callback();
			}
		]
	);
});

app.listen(process.env.PORT || 5000)