// const student1 = {
// id: 1,
//     name: "Reed",
//     subjects: [],
//     addSubjects(subject){
//         this.subjects = [...this.subjects, subject];
//     }
// }

//instead of making a singular object for all the students we can use a constructor function

function Student(id, name, subjects = []){
    this.id = id;
    this.name = name;
    this.subjects = subjects;
}

Student.prototype.addSubject = function(subject) {
    this.subjects = [...this.subjects, subject];   
}

Student.prototype.removeSubject = function(subject){
    this.subjects = this.subjects.filter(s => s !== subject);
    
}


const student1 = new Student(1, 'Reed');
student1.addSubject('Math');


