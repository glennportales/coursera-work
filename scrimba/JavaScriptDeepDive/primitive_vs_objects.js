/*
Primitive types include: undefined, null, boolean, number, string, symbol

When we create a primitive type, the data is copied. That is, primitive values are passed by value. 

When we assign a variable to an object, the variable reciebes NOT a copy of it, instead it gets a reference to it. That is, object values are passed by reference. 

Unlike primitives, we have the ability to dynamically add properties to objects. This is why objects are mutable. 
*/

const colors = {
    yellow: "#ff0",
    blue: "#f00",
    orange: "#ff0"
}

colors.red = "#f00";

function getColor(key) {
    return colors.key;
}

// Challenge: The recommendations object contains a set of of nice places to visit in Brighton, UK,
// organized by what you'd like to do (eat pancakes, drink coffee etc).

// 1. Destructure the places to drink (coffee and beer) from recommendations
// 2. Destructure the places to listen to music
// 3. Write a function that takes the recommendations object as an argument and that
//      a) Logs out the music venues in recommendations when invoked 
//      b) Uses object descructuring to get the "traditional" and "jazz" keys from the argument

const recommendations = {
    pancakes: 'Nowhere Man',
    riceBowls: 'Pompoko',
    beer: 'The Craft Beer Co.',
    coffee: 'Coffee Roasters',
    small_plates: 'Venetian Plates',
    music: { 
        traditional: 'Fiddler\'s Elbow', 
        jazz: 'The Paris House'
    }
}
const { coffee, beer } = recommendations;

const { traditional, jazz } = recommendations.music;

function musicRecommendations ({ music: {traditional, jazz} } ){
    console.log(traditional, jazz)
}

musicRecommendations(recommendations)