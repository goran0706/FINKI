const tbody = document.querySelector("tbody");
const selectedUsersEl = document.querySelector(".selected-users");

async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  return data;
}

fetchUsers()
  .then((users) => {
    users.forEach((user) => {
      const { id, name, username, email, phone } = user;
      const html = `
          <tr>
              <td>${id}</td>
              <td>${name}</td>
              <td>${username}</td>
              <td>${email}</td>
              <td>${phone}</td>
          </tr>
      `;

      tbody.insertAdjacentHTML("beforeEnd", html);
    });
  })
  .catch((err) => console.log(err));

// Event Delegation
let selectedUsers = [];

tbody.addEventListener("click", (event) => {
  event.target.parentElement.classList.toggle("selected");
  const user = event.target.parentElement.children[1].textContent;
  selectedUsers.includes(user)
    ? (selectedUsers = selectedUsers.filter((u) => u !== user))
    : (selectedUsers = [...selectedUsers, user]);
  selectedUsersEl.textContent = selectedUsers.join(", ");
});
