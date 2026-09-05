const book = {
  title: "Book1",
  author: "John Doe",
  genres: ["Comedy", "Romance", "Fantasy"],
};

// Object destructuring
const { title, author, genres } = book;

// Array destructuring
const [primaryGenre, secondaryGenre] = genres;

// Rest operator
const [mainGenre, ...allOtherGenres] = genres;

// Array spread operator, add new elements before or after spread operator
const updatedGenres = [...genres, "Drama"];

const updatedBook = {
  // Object spread operator
  ...book,

  // Add new fields or override existing fields - must come after spread operator

  // Overwriting an existing property
  genres: updatedGenres,

  // Adding a new property
  publication: "2001-12-20",
};
