const questions = document.querySelectorAll(".question");

questions.forEach((question) => {
  question.addEventListener("click", (event) => {
    const answer = question.nextElementSibling;
    answer.style.display === "none"
      ? (answer.style.display = "block")
      : (answer.style.display = "none");
  });
});
