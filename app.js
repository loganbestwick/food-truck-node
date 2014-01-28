var express = require('express');
var geoMethods = require('geo-methods');
var hbs = require('hbs');
var app = express();
 
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){
	response.render('index');
});

app.get('/search', function(request, response){
	var search_location = geoMethods.get_longitude_latitude(request.query.search_address);
	var url = "https://data.sfgov.org/resource/rqzj-sfat.json"
});

app.listen(3000);