const books = [
  { title: "Harry Potter", genres: ["Drama", "Supernatural"] },
  { title: "Harry Potter and the Dragons", genres: ["Drama", "Supernatural"] },
  { title: "Transformers", genres: ["Action", "Sci-Fi"] },
];

// 1) Add book object to array
const newBook = {
  id: 6,
  title: "Harry Potter and the Chamber of Secrets",
  author: "J. K. Rowling",
};

const booksAfterAdd = [...books, newBook];
booksAfterAdd;

// 2) Update book object in the array
const booksAfterUpdate = booksAfterDelete.map((book) =>
  book.id === 1 ? { ...book, pages: 1210 } : book
);
booksAfterUpdate;

// 3) Delete book object from array
const booksAfterDelete = booksAfterAdd.filter((book) => book.id !== 3);
booksAfterDelete;
