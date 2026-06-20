const statusMessage = document.querySelector(".menu-status");
const selectionStatus = document.querySelector(".selection-status");
const titleScreen = document.querySelector("#title-screen");
const selectionScreen = document.querySelector("#selection-screen");
const attributeScreen = document.querySelector("#attribute-screen");
const characterCards = document.querySelectorAll("[data-character]");
const selectedClass = document.querySelector("[data-selected-class]");
const selectedPortrait = document.querySelector("[data-selected-portrait]");
const pointsRemaining = document.querySelector("[data-points-remaining]");
const attributeLists = {
  left: document.querySelector('[data-attribute-list="left"]'),
  right: document.querySelector('[data-attribute-list="right"]'),
  vitals: document.querySelector('[data-attribute-list="vitals"]'),
};
const actions = {
  "continue-game": "No saved quest was found, but the dragon is watching.",
};
const POINT_POOL = 50;
const ATTRIBUTE_GROUPS = {
  left: [
    "Strength",
    "Intelligence",
    "Agility",
    "Vitality",
    "Luck",
    "Magic",
    "Experience",
    "Puzzle Pts.",
  ],
  right: [
    "Weapon Use",
    "Parry",
    "Dodge",
    "Stealth",
    "Pick Locks",
    "Throwing",
    "Climbing",
    "Comm.",
    "Honor",
  ],
  vitals: ["Health", "Stamina", "Mana"],
};
const CLASS_STARTS = {
  Knight: {
    Strength: 28,
    Intelligence: 12,
    Agility: 16,
    Vitality: 24,
    Luck: 14,
    Magic: 4,
    Experience: 0,
    "Puzzle Pts.": 0,
    "Weapon Use": 26,
    Parry: 24,
    Dodge: 16,
    Stealth: 8,
    "Pick Locks": 4,
    Throwing: 12,
    Climbing: 14,
    "Comm.": 10,
    Honor: 22,
    Health: 34,
    Stamina: 30,
    Mana: 4,
  },
  Wizard: {
    Strength: 10,
    Intelligence: 28,
    Agility: 14,
    Vitality: 14,
    Luck: 16,
    Magic: 30,
    Experience: 0,
    "Puzzle Pts.": 0,
    "Weapon Use": 8,
    Parry: 8,
    Dodge: 14,
    Stealth: 10,
    "Pick Locks": 6,
    Throwing: 10,
    Climbing: 8,
    "Comm.": 18,
    Honor: 14,
    Health: 22,
    Stamina: 18,
    Mana: 36,
  },
  Thief: {
    Strength: 16,
    Intelligence: 18,
    Agility: 28,
    Vitality: 16,
    Luck: 24,
    Magic: 6,
    Experience: 0,
    "Puzzle Pts.": 0,
    "Weapon Use": 14,
    Parry: 12,
    Dodge: 26,
    Stealth: 30,
    "Pick Locks": 30,
    Throwing: 22,
    Climbing: 28,
    "Comm.": 18,
    Honor: 10,
    Health: 24,
    Stamina: 28,
    Mana: 8,
  },
};

let baseAttributes = {};
let currentAttributes = {};
let remainingPoints = POINT_POOL;

function showScreen(screenToShow) {
  [titleScreen, selectionScreen, attributeScreen].forEach((screen) => {
    const isActive = screen === screenToShow;
    screen.hidden = !isActive;
    screen.classList.toggle("is-active", isActive);
  });
}

function renderAttributeRow(attributeName) {
  const row = document.createElement("div");
  row.className = "attribute-row";

  const label = document.createElement("span");
  label.className = "attribute-name";
  label.textContent = attributeName;

  const value = document.createElement("span");
  value.className = "attribute-value";
  value.dataset.attributeValue = attributeName;
  value.textContent = currentAttributes[attributeName];

  const controls = document.createElement("span");
  controls.className = "attribute-controls";

  const upButton = document.createElement("button");
  upButton.className = "step-button";
  upButton.type = "button";
  upButton.dataset.attribute = attributeName;
  upButton.dataset.direction = "up";
  upButton.setAttribute("aria-label", `Increase ${attributeName}`);
  upButton.textContent = "▲";

  const downButton = document.createElement("button");
  downButton.className = "step-button";
  downButton.type = "button";
  downButton.dataset.attribute = attributeName;
  downButton.dataset.direction = "down";
  downButton.setAttribute("aria-label", `Decrease ${attributeName}`);
  downButton.textContent = "▼";

  controls.append(upButton, downButton);
  row.append(label, value, controls);

  return row;
}

function updateAttributeControls() {
  pointsRemaining.textContent = remainingPoints;

  document.querySelectorAll("[data-attribute-value]").forEach((value) => {
    value.textContent = currentAttributes[value.dataset.attributeValue];
  });

  document.querySelectorAll("[data-attribute][data-direction]").forEach((button) => {
    const attribute = button.dataset.attribute;
    const isIncrease = button.dataset.direction === "up";
    button.disabled = isIncrease
      ? remainingPoints === 0
      : currentAttributes[attribute] <= baseAttributes[attribute];
  });
}

function renderAttributes() {
  Object.entries(ATTRIBUTE_GROUPS).forEach(([group, attributes]) => {
    attributeLists[group].replaceChildren(...attributes.map(renderAttributeRow));
  });

  updateAttributeControls();
}

function uniquifySvgIds(container, suffix) {
  const idMap = new Map();

  container.querySelectorAll("[id]").forEach((element) => {
    const newId = `${element.id}-${suffix}`;
    idMap.set(element.id, newId);
    element.id = newId;
  });

  container.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      let value = attribute.value;

      idMap.forEach((newId, oldId) => {
        value = value.replaceAll(`url(#${oldId})`, `url(#${newId})`);
        value = value.replaceAll(`#${oldId}`, `#${newId}`);
      });

      if (value !== attribute.value) {
        element.setAttribute(attribute.name, value);
      }
    });
  });
}

function showAttributesFor(card) {
  const character = card.dataset.character;
  const portrait = card.querySelector(".portrait-frame").cloneNode(true);

  uniquifySvgIds(portrait, `attribute-${character.toLowerCase()}`);
  selectedClass.textContent = character;
  selectedPortrait.replaceChildren(portrait);
  baseAttributes = { ...CLASS_STARTS[character] };
  currentAttributes = { ...CLASS_STARTS[character] };
  remainingPoints = POINT_POOL;
  renderAttributes();
  showScreen(attributeScreen);
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

    if (button.dataset.action === "back-selection") {
      showScreen(selectionScreen);
      selectionStatus.textContent = "Pick your champion.";
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

    selectionStatus.textContent = `${card.dataset.character} selected.`;
    showAttributesFor(card);
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-attribute][data-direction]");

  if (!button) {
    return;
  }

  const attribute = button.dataset.attribute;
  const direction = button.dataset.direction;

  if (direction === "up" && remainingPoints > 0) {
    currentAttributes[attribute] += 1;
    remainingPoints -= 1;
  }

  if (direction === "down" && currentAttributes[attribute] > baseAttributes[attribute]) {
    currentAttributes[attribute] -= 1;
    remainingPoints += 1;
  }

  updateAttributeControls();
});
