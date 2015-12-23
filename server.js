var express = require('express');
var bodyParser = require('body-parser');

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
	var matchedTodo;
	todos.forEach(function(todo){
		if(todo.id === todoId)
			matchedTodo = todo;
	});
	if(typeof matchedTodo === 'undefined'){
		res.status(404).send();
	}
	else{
		res.json(matchedTodo)	
	}
});

//POST /todos
app.post('/todos', function(req, res){
	var body = req.body;	
	console.log('description: ' + body.description);
	var todo = body;
	todo.id = todoNextId;
	todoNextId++;
	todos.push(todo);
	res.json(todo);
});


app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
