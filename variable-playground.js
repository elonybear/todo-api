var person = {
	name: 'Elon',
	age: 21
}

function updatePerson(obj){
	obj.age = 24;
}
console.log("Before: " + JSON.stringify(person));
updatePerson(person);
console.log("After: " + JSON.stringify(person));


var grades = [15, 37];

function updateArray(array, val){
	array.push(val);	
	debugger;
}

function notUpdateArray(array, val){
	array = [15, 37, val];
}

console.log(grades);
notUpdateArray(grades, 10);
console.log(grades);
updateArray(grades, 10);
console.log(grades);



