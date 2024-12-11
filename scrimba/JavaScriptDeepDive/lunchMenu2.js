const breakfastMenuIdeas = ["Buckwheat Pancakes"];
const dinnerMenuIdeas = ["Glazed Salmon", "Meatloaf", "American Cheeseburger"];
//We can use array spread to add new elements to the arrays. 
const allMenuIdeas = [
    ...breakfastMenuIdeas, 
    "Harvest Salad", 
    "Southern Fried Chicken",
    ...dinnerMenuIdeas
];
//This retrieves the index of a value we want to change
const saladIndex = allMenuIdeas.findIndex(idea => idea === 'Harvest Salad');
//we use array spread to slice the original array up to the index we want to change, then add the new value, and then add the rest of the array.
const finalMenuIdeas = [
  ...allMenuIdeas.slice(0, saladIndex),
  "Garden Salad",
  ...allMenuIdeas.slice(saladIndex + 1)
];

const meatloafIndex = finalMenuIdeas.findIndex(idea => idea === 'Meatloaf');

const finalfinalMenu = [
    ...finalMenuIdeas.slie(0, meatloafIndex), ...finalMenuIdeas.slice(meatloafIndex + 1)
];

console.log(finalfinalMenu);