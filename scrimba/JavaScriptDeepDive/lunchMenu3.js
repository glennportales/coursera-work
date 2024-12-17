const finalMenuItems = [
    "American Cheeseburger",
    "Southern Fried Chicken",
    "Glazed Salmon"
  ];

  
  // console.log({ winner, losers });
  // let [first, second] = finalMenuItems;
  // [second, first] = [first, second];
  // let first = finalMenuItems[0];
  // let second = finalMenuItems[1];
  // let third = finalMenuItems[2];
  
  //we can swap values using destructuring

const [winner, ...losers] = finalMenuItems;

console.log({ losers} );