
function handleLikePosT(){
    let likeCount = 0;
    
    return function addLike(){
        likeCount +=1;
        return likeCount;
    }
}
like = handleLikePosT();
console.log(like());

// => is called fat arrow syntax
// => is used to define a function in a more concise way

const username = 'john';

const capitalize = (name) => `${name.charAt(0).toUpperCase()}${name.slice(1)}`;


const split = (amount, numPeople) => `Each person needs to pay ${amount / numPeople}`;


function countdown(startingNumber, step) {
    let countFromNum = startingNumber + step;
    return function decrease() {
      countFromNum -= step;
      return countFromNum;
    }
  }

  const countdown = (startingNumber, step) => {
    let countFromNum = startingNumber + step;
    return () => countFromNum -= step;
  }