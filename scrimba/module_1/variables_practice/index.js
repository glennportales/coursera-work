let firstName = "Glenn";
let lastName = "Rivera";
let fullName = firstName+  " " + lastName;
console.log(fullName);


let name = "Linda";
let greeting = "Hi there";

function  sayHello() {
    console.log(greeting + ", " + name+"!");
}

sayHello();

let myPoints = 3;

function add3Points(){
    myPoints += 3;
}

function remove1Point(){
    myPoints -= 1;
}

add3Points();
add3Points();
add3Points();
remove1Point();
remove1Point();
