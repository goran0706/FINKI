const elements = [1, 2, 3, 4, 5];
const results = elements.map((e) => e * 2); // not mutative method

console.log(elements);
console.log(results);

const movies = [
  { title: "Harry Potter", genres: ["Drama", "Supernatural"] },
  { title: "Harry Potter and the Dragons", genres: ["Drama", "Supernatural"] },
  { title: "Transformers", genres: ["Action", "Sci-Fi"] },
];

// extract all the movies titles from the movies list
const movieTitles = movies.map((movie) => movie.title);
console.log(movieTitles);
