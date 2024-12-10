const numbers = [1, 2, 3, 4, 5, 6];

const doubledNumbers = numbers.reduce((acc, num) => {
    acc.push(num * 2);
    return acc;
}, []);

console.log('doubled numbers', doubledNumbers);
console.log('numbers', numbers);

//exact same as above but in different code.
const doubledMap = numbers.map(num => num * 2);

const biggerThan3 = numbers.reduce((acc, num) => {
    if (num > 3) {
        acc.push(num);
    }
    return acc;
}, []);

//does the same thing as the above code but in a different syntax.
const greaterNumbers = numbers.filter(num => num > 3);
