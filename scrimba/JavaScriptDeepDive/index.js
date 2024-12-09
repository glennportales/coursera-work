const colors = {
    blue: '#00f',
    orange: '#f60',
    yellow: '#ff0'
}
//Instead of this we use Objects. 

const obj ={
    sayHi() {
        console.log('Hi');
    }
}

obj.sayHi();


const bar = "Caféstudio";
const cafe = "Hacienda Carrion"
const restaurant = "Chili's"

const favoritePlaces = {
    bar,
    cafe,
    restaurant,
    greeting() {
        console.log('Welcome to my favorite places');
    }
}

console.log(favoritePlaces.greeting())
console.log(favoritePlaces)
