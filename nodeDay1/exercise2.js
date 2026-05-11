let deck = [5, 9, 7, 1, 8];

// First - get the first card
const getFirstCard = (deck) => {
  let [firstCard] = deck;
  console.log(firstCard);
};

getFirstCard(deck);
// => 5

// Second - get the second card
const getSecondCard = (deck) => {
  let [first, second] = deck;
  console.log(second);
};

deck = [3, 2, 10, 6, 7];
getSecondCard(deck);
// => 2

// Third - swap top two cards
deck = [10, 7, 3, 8, 5];
const swapTopTwoCards = (deck) => {
  const [firstCard, secondCard, ...rest] = deck;
  deck = [secondCard, firstCard, ...rest];
  console.log(deck);
};

swapTopTwoCards(deck);
// => [7, 10, 3, 8, 5]

// Fourth - discard top card
deck = [2, 5, 4, 9, 3];

const discardTopCard = (deck) => {
  const [firstCard, ...rest] = deck;
  // const finalDeck = [firstCard, rest];
  const finalDeck = rest;

  console.log("finaldeck:", finalDeck);
};

discardTopCard(deck);
// => [2, [5, 4, 9, 3]]
// => [5, 4, 8, 3]

// Fifth - insert face cards after first card
deck = [5, 4, 7, 10];

const insertFaceCards = (deck) => {
  const newValues = ["jack", "queen", "king"];
  const [firstCard, ...rest] = deck;
  const newDeck = [firstCard, ...newValues, ...rest];
  console.log(newDeck);
};

insertFaceCards(deck);
// => [5, 'jack', 'queen', 'king', 4, 7, 10]
