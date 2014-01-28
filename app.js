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
	var trucksInRange = [];
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
				console.log(searchLocation);
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
				findTrucks(truckData, searchLocation, parseFloat(request.query.radius));
				console.log(trucksInRange.length);
				console.log(trucksInRange);
				response.send(trucksInRange);
				callback();
			}
		]
	);

	var findTrucks = function(trucksArray, searchLocation, range){
		for (var i = 0; i < trucksArray.length; i++) {
			if (trucksArray[i].latitude != null){
				var distance = geoMethods.coorDist(searchLocation.latitude, searchLocation.longitude, 
					parseFloat(trucksArray[i].latitude), parseFloat(trucksArray[i].longitude));
				if (distance <= range) {
					console.log("test 3");
					trucksInRange.push(trucksArray[i]);
				}
			}
		};
	}

});

app.listen(3000);