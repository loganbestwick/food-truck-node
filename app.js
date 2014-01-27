
var express = require('express');
var hbs = require('hbs');

var blogEngine = require('./blog');

var app = express();

 
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.get('/', function(request, response){
	response.render('index', {title: "My Blog", entries : blogEngine.getBlogEntries()});
});

app.get('/about', function(request, response){
	response.render('about', {title : "About Me"});
});

app.get('/article/:id', function(request, response){
	console.log(request.params)
	var entry = blogEngine.getBlogEntry(request.params.id);
	response.render('article', {title: entry.title, blog:entry});
});

app.listen(3000);