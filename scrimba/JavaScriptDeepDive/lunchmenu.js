const lunchMenuIdeas = ['Harvest Salad', 'Southern Fried Chicken'];

//... spreads all the items and allows us to clone the items and pass them to another, new array. 
const allMenuIdeas = [...lunchMenuIdeas];
//Concat is a non-mutating array method. If we append, since arrays are reference-type objects, the values for both lunchMenuIdeas and allMenuIdeas would change.

//Since we used the spread operator [...] to clone the array, we can use the push method on allMenuIdeas and leave the lunchMenuIdeas array intact. 

allMenuIdeas.push('Club Sandwich');



