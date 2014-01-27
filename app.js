var express = require('express');
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
});

app.listen(3000);