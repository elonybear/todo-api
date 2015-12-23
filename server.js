var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 0,
	description: 'Get dressed',
	completed: false
}, {
	id: 1,
	description: 'Buy food',
	completed: false
}, {
	id: 2,
	description: 'Go outside',
	completed: true
}];

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

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
