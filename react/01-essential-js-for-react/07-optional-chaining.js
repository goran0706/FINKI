function getTotalReviewCount(book) {
  const goodReads = book.reviews?.goodReads?.reviewsCount ?? 0;
  const libraryThing = book.reviews?.libraryThing?.reviewsCount ?? 0;
  return goodReads + libraryThing;
}

const book = { title: "Harry Potter" };
console.log(getTotalReviewCount(book));
