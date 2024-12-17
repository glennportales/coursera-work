//each instantiated object (from constructor function) inherits from prototype

//every object has prototype 

function Student(id, name, subjects = []) {
    this.id = id;
    this.name = name;
    this.subjects = subjects;
}
  
const student1 = new Student(1, 'Reed');
  
// console.log(Object.getPrototypeOf(student1).constructor);
console.log(student1.__proto__ === Student.prototype);
console.log(student.__proto__.__proto__ === Object.prototype);

//student.__proto__.__proto__.__proto__ is null because that's the end of the prototype chain. In essence, all new objects inherit from Object(). We can create object prototypes based on the prototype of other objects, which in turn inherit the prototype of the object Object(). This is the end of the prototype chain.