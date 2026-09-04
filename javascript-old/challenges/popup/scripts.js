const openButton = document.querySelector("button");
const closeButton = document.querySelector(".popup-close");
const popup = document.querySelector(".popup-wrapper");

openButton.addEventListener("click", () => {
  popup.style.display = "block";
});

closeButton.addEventListener("click", () => {
  popup.style.display = "none";
});

popup.addEventListener("click", (event) => {
  if (event.currentTarget === event.target) {
    popup.style.display = "none";
  }
});
