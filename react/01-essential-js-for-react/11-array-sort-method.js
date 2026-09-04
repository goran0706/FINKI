const movies = [
  { title: "Transformers", genres: ["Action", "Sci-Fi"] },
  { title: "Harry Potter", genres: ["Drama", "Supernatural"] },
  { title: "Harry Potter and the Dragons", genres: ["Drama", "Supernatural"] },
];

const sortedMoviesByTitle = movies.sort((a, b) =>
  a.title.localeCompare(b.title)
);
console.log(sortedMoviesByTitle);
