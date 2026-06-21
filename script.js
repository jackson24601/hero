const statusMessage = document.querySelector(".menu-status");
const selectionStatus = document.querySelector(".selection-status");
const titleScreen = document.querySelector("#title-screen");
const selectionScreen = document.querySelector("#selection-screen");
const attributeScreen = document.querySelector("#attribute-screen");
const characterCards = document.querySelectorAll("[data-character]");
const selectedClass = document.querySelector("[data-selected-class]");
const selectedPortrait = document.querySelector("[data-selected-portrait]");
const pointsRemaining = document.querySelector("[data-points-remaining]");
const allocationStatus = document.querySelector("[data-allocation-status]");
const beginQuestButton = document.querySelector("[data-begin-quest]");
const attributeLists = {
  left: document.querySelector('[data-attribute-list="left"]'),
  right: document.querySelector('[data-attribute-list="right"]'),
  vitals: document.querySelector('[data-attribute-list="vitals"]'),
};
const actions = {
  "continue-game": "No saved quest was found, but the dragon is watching.",
};
const POINT_POOL = 50;
const ATTRIBUTE_STEP = 5;
const MAX_ATTRIBUTE_VALUE = 100;
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
    Strength: 85,
    Intelligence: 40,
    Agility: 75,
    Vitality: 75,
    Luck: 50,
    Magic: 10,
    Experience: 20,
    "Puzzle Pts.": 0,
    "Weapon Use": 85,
    Parry: 85,
    Dodge: 70,
    Stealth: 40,
    "Pick Locks": 0,
    Throwing: 70,
    Climbing: 60,
    "Comm.": 0,
    Honor: 0,
    Health: 100,
    Stamina: 75,
    Mana: 10,
  },
  Wizard: {
    Strength: 40,
    Intelligence: 85,
    Agility: 50,
    Vitality: 65,
    Luck: 50,
    Magic: 85,
    Experience: 20,
    "Puzzle Pts.": 0,
    "Weapon Use": 40,
    Parry: 40,
    Dodge: 60,
    Stealth: 60,
    "Pick Locks": 0,
    Throwing: 40,
    Climbing: 40,
    "Comm.": 0,
    Honor: 0,
    Health: 100,
    Stamina: 60,
    Mana: 100,
  },
  Thief: {
    Strength: 60,
    Intelligence: 60,
    Agility: 85,
    Vitality: 75,
    Luck: 80,
    Magic: 10,
    Experience: 20,
    "Puzzle Pts.": 0,
    "Weapon Use": 60,
    Parry: 60,
    Dodge: 75,
    Stealth: 85,
    "Pick Locks": 0,
    Throwing: 60,
    Climbing: 80,
    "Comm.": 0,
    Honor: 0,
    Health: 100,
    Stamina: 65,
    Mana: 10,
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
  upButton.setAttribute("aria-label", `Increase ${attributeName} by ${ATTRIBUTE_STEP}`);
  upButton.textContent = "▲";

  const downButton = document.createElement("button");
  downButton.className = "step-button";
  downButton.type = "button";
  downButton.dataset.attribute = attributeName;
  downButton.dataset.direction = "down";
  downButton.setAttribute("aria-label", `Decrease ${attributeName} by ${ATTRIBUTE_STEP}`);
  downButton.textContent = "▼";

  controls.append(upButton, downButton);
  row.append(label, value, controls);

  return row;
}

function updateAttributeControls() {
  pointsRemaining.textContent = remainingPoints;
  allocationStatus.textContent = remainingPoints === 0
    ? "All points allocated. Your hero is ready."
    : `Allocate all points to continue: ${remainingPoints} remaining.`;
  beginQuestButton.disabled = remainingPoints !== 0;

  document.querySelectorAll("[data-attribute-value]").forEach((value) => {
    value.textContent = currentAttributes[value.dataset.attributeValue];
  });

  document.querySelectorAll("[data-attribute][data-direction]").forEach((button) => {
    const attribute = button.dataset.attribute;
    const isIncrease = button.dataset.direction === "up";
    button.disabled = isIncrease
      ? remainingPoints < ATTRIBUTE_STEP || currentAttributes[attribute] + ATTRIBUTE_STEP > MAX_ATTRIBUTE_VALUE
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

    if (button.dataset.action === "begin-quest") {
      allocationStatus.textContent = remainingPoints === 0
        ? "Your hero is ready. The quest will begin in the next chapter."
        : `Allocate all points to continue: ${remainingPoints} remaining.`;
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

  if (
    direction === "up"
    && remainingPoints >= ATTRIBUTE_STEP
    && currentAttributes[attribute] + ATTRIBUTE_STEP <= MAX_ATTRIBUTE_VALUE
  ) {
    currentAttributes[attribute] += ATTRIBUTE_STEP;
    remainingPoints -= ATTRIBUTE_STEP;
  }

  if (direction === "down" && currentAttributes[attribute] > baseAttributes[attribute]) {
    currentAttributes[attribute] -= ATTRIBUTE_STEP;
    remainingPoints += ATTRIBUTE_STEP;
  }

  updateAttributeControls();
});
