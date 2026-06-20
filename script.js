const statusMessage = document.querySelector(".menu-status");
const actions = {
  "new-game": "A new quest awaits. Gather your courage!",
  "continue-game": "No saved quest was found, but the dragon is watching.",
};

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    statusMessage.textContent = actions[button.dataset.action];
  });
});
