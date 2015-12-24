var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 0;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res){
	var queryParams = req.query;

	var filteredTodos = todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(todos, {completed: true});
	}
	else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos, {completed: false});
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toUpperCase().indexOf(queryParams.q.toUpperCase()) != -1;
		});
	}
	
	res.json(filteredTodos);	
});

// GET /todos/0
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(typeof matchedTodo === 'undefined'){
		res.status(404).send({"error": "no todo found with that id"});
	}
	else{
		res.json(matchedTodo)	
	}

});

//POST /todos
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');	
	if(body.description && body.description.trim().length === 0){
		res.status(400).send({"error": "invalid post request"});
		return;
	}
	db.todo.create(body).then(function(todo){
		res.send(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

// DELETE
app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(typeof matchedTodo === 'undefined'){
		res.status(404).send({ "error": "no todo found with that id" });
	}
	else{
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);	
	}	
});

app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');	
	if(typeof matchedTodo === 'undefined'){
		res.status(404).send({ "error": "no todo found with that id" });
	}

	var validAttributes = {};
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}
	else if(body.hasOwnProperty('completed')){
		return res.status(400).send({"error": "invalid PUT request"});
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.length > 0){
		body.description = body.description.trim();
		validAttributes.description = body.description;
	}
	else if(body.hasOwnProperty('description')){
		return res.status(400).send({"error": "invalid PUT request"});	
	}
	
	_.extend(matchedTodo, validAttributes);	

	res.json(matchedTodo);
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log('Express listening on port ' + PORT + '!');
	});
});
