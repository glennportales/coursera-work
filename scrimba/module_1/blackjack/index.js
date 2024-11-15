let firstCard = 0;
let secondCard = 0;
let cards = []; //Cards array -- Ordered List of items.
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let messageEl =  document.getElementById("message-el");
//let sumEl = document.getElementById("sum-el");
let cardsEl = document.querySelector("#cards-el");
let sumEl = document.querySelector("#sum-el");

let player = {
    name: "Glenn",
    chips: 145
}

let playerEl = document.getElementById("credits-el");
playerEl.textContent = player.name + `: $${player.chips}`;

function getRandomCard() {
    let randomNumer = Math.floor( Math.random()*13 ) + 1
    if (randomNumer > 10) {
        return 10
    } else if (randomNumer === 1) {
        return 11
    } else {
        return randomNumer
    }
  }

function startGame(){
    isAlive = true;
    firstCard = getRandomCard();
    secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;
    renderGame();
}

function renderGame(){
    //Render out firstCard and secondCard
    cardsEl.textContent = "Cards: " 
    for (i = 0; i < cards.length;  i++){
        cardsEl.textContent +=  cards[i] + " ";
    }
    sumEl.textContent = "Sum: " + sum;
    if  (sum <= 20) {
        message ="Do you want to draw a new card?";
    }
    else if (sum === 21) {
        message="Wohoo! You've got blackjack!";
        hasBlackJack = true;
    }
    else{
        message="Sorry, you went over. You lose this round.";
        isAlive = false;
    }
   messageEl.textContent=message;   
}

function newCard(){
    if( isAlive && !hasBlackJack){
        let card = getRandomCard();
        sum += card;
        cards.push(card);
        renderGame();
    }
    else{
        alert("You can't draw any more cards!");
    }
}
//Example Object structure
let course= {
    title: 'Learn CSS grid for free',
    lessons: 16,
    creator: 'Glenn',
    length: 63,
    level: 2,
    isFree: true,
    tags: ["html", "css"]
}
