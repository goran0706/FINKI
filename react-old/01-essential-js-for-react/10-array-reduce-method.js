const movies = [
  { title: "Harry Potter", genres: ["Drama", "Supernatural"] },
  { title: "Harry Potter and the Dragons", genres: ["Drama", "Supernatural"] },
  { title: "Transformers", genres: ["Action", "Sci-Fi"] },
];

const actionMovies = movies.reduce((acc, movie) => {
  const isAction = movie.genres.includes("Action");
  return isAction ? [...acc, movie] : acc;
}, []);

console.log(actionMovies);

const dramaMovies = movies.reduce((acc, movie) => {
  const isDrama = movie.genres.includes("Drama");
  return isDrama ? [...acc, movie] : acc;
}, []);

console.log(dramaMovies);
