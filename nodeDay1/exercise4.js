// 4. Make a function that takes in a single parameter and returns a new promise. using setTimeout, after 500 milliseconds, the promise will either resolve or reject.
// if the input is a "string", the promise "resolves" with that same string in "uppercase".
// if the input is "anything" but a string, it "rejects" with that same input.

// call the function "delayedUpperCase"

const delayedUpperCase = (input) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof input === "string") {
        resolve(input.toUpperCase());
      } else {
        reject(input);
      }
    }, 500);
  });
};

delayedUpperCase(NULL)
  .then((result) => console.log(result))
  .catch((err) => console.log("Rejected:", err));

// delayedUpperCase(42)
//   .then((result) => console.log(result))
//   .catch((err) => console.log("Rejected:", err));

// delayedUpperCase("tushar")
//   .then((result) => console.log(result))
//   .catch((err) => console.log("Rejected:", err));
