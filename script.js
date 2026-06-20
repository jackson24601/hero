const statusMessage = document.querySelector(".menu-status");
const selectionStatus = document.querySelector(".selection-status");
const titleScreen = document.querySelector("#title-screen");
const selectionScreen = document.querySelector("#selection-screen");
const characterCards = document.querySelectorAll("[data-character]");
const actions = {
  "continue-game": "No saved quest was found, but the dragon is watching.",
};

function showScreen(screenToShow) {
  [titleScreen, selectionScreen].forEach((screen) => {
    const isActive = screen === screenToShow;
    screen.hidden = !isActive;
    screen.classList.toggle("is-active", isActive);
  });
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action === "new-game") {
      showScreen(selectionScreen);
      selectionStatus.textContent = "Pick your champion.";
      return;
    }

    if (button.dataset.action === "back-title") {
      showScreen(titleScreen);
      statusMessage.textContent = "Choose your path, adventurer.";
      return;
    }

    statusMessage.textContent = actions[button.dataset.action];
  });
});

characterCards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", () => {
    characterCards.forEach((otherCard) => {
      const isSelected = otherCard === card;
      otherCard.classList.toggle("is-selected", isSelected);
      otherCard.setAttribute("aria-pressed", String(isSelected));
    });

    selectionStatus.textContent = `${card.dataset.character} selected. Your quest begins soon.`;
  });
});
