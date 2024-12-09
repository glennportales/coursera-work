//Much more flexible collectible data with arrays. 

const todos = [];

const todo1 = {
    text: 'Buy milk',
    done: false
};



const todo2 = {
    test: 'Walk the dog',
    done: false
};

todos.push(todo1, todo2);



const favoriteSongs = [];
favoriteSongs.push('Kiss Kiss', 'Love Me Like You Do', 'I Want It That Way');
console.log(favoriteSongs[favoriteSongs.length-1])
favoriteSongs.pop();
console.log(favoriteSongs);