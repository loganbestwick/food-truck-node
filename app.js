var express = require('express');
var app = express();
 
app.get('/', function(request, response){
	response.sendfile('./views/index.html');
});

app.get('/about', function(request, response){
	response.sendfile('./views/about.html');
});

app.get('/article', function(request, response){
	response.sendfile('./views/article.html');
});

app.listen(3000);