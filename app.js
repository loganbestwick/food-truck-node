var express = require('express');
var geoMethods = require('geo-methods');
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
	var searchLocation = geoMethods.get_longitude_latitude(request.query.search_address);
	
	var options = {host: 'data.sfgov.org', path: '/resource/rqzj-sfat.json', method: 'GET'}
	var truckData = '';
	https.get(options, function(response){
		response.on('data', function(chunk){
			truckData += chunk;
		});
		response.on('end', function(){
			JSON.parse(truckData);
		})
	})

	var truck_results = findTrucks(truckData, searchLocation, parseFloat(request.query.search_address));



});


var findTrucks = function(trucksArray, searchLocation, range){
	var trucksInRange = [];
	truckArray.forEach(function(truck){
		var distance = geoMethods.coorDist(searchLocation.latitude, searchLocation.longitude, 
			parseFloat(truck.latitude), parseFloat(truck.longitude));
		if (distance <= range) {
			truckInRange.push(truck);
		}
	});
	return trucksInRange;
}

app.listen(3000);