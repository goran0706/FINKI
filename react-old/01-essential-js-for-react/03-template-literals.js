const book = {
  title: "Book1",
  author: "John Doe",
  genres: ["Comedy", "Romance", "Fantasy"],
};

// Object destructuring
const { title, author, genres } = book;

// Template literal
const summary = `
The book ${title} was created by ${author}. 
Has the following genres: ${genres.join(", ")}.
`;

console.log(summary);
