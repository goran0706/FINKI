const movies = [
  { title: "Harry Potter", genres: ["Drama", "Supernatural"] },
  { title: "Harry Potter and the Dragons", genres: ["Drama", "Supernatural"] },
  { title: "Transformers", genres: ["Action", "Sci-Fi"] },
];

const actionMovies = movies.filter((movie) => movie.genres.includes("Action"));
console.log(actionMovies);

const dramaMovies = movies.filter((movie) => movie.genres.includes("Drama"));
console.log(dramaMovies);

const supernatural = movies
  .filter((movies) => movies.genres.includes("Supernatural"))
  .map((book) => book.title);
console.log(supernatural);
