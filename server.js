var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 0;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
	res.json(todos);	
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
	body.description = body.description.trim();
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0){
		return res.status(400).send({"error": "invalid todo POST request"});
	}
	var todo = body;
	todo.id = todoNextId;
	todoNextId++;
	todos.push(todo);
	res.json(todo);
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

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
