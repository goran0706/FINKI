const isLoading = true;
isLoading ? console.log("Loading") : console.log("Ready");

const pages = 2000;
const pagesRange = pages > 1000 ? "over a thousand" : "less than 1000";
console.log(`The book has ${pagesRange} pages`);
