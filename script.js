const statusMessage = document.querySelector(".menu-status");
const selectionStatus = document.querySelector(".selection-status");
const titleScreen = document.querySelector("#title-screen");
const selectionScreen = document.querySelector("#selection-screen");
const attributeScreen = document.querySelector("#attribute-screen");
const introScreen = document.querySelector("#intro-screen");
const gameScreen = document.querySelector("#game-screen");
const characterCards = document.querySelectorAll("[data-character]");
const selectedClass = document.querySelector("[data-selected-class]");
const selectedPortrait = document.querySelector("[data-selected-portrait]");
const pointsRemaining = document.querySelector("[data-points-remaining]");
const allocationStatus = document.querySelector("[data-allocation-status]");
const beginQuestButton = document.querySelector("[data-begin-quest]");
const adventureScene = document.querySelector("[data-adventure-scene]");
const playerSprite = document.querySelector("[data-player-sprite]");
const playerMarker = document.querySelector("[data-player-marker]");
const movementStatus = document.querySelector("[data-movement-status]");
const sceneTitle = document.querySelector("[data-scene-title]");
const gridLocation = document.querySelector("[data-grid-location]");
const edgeBlockers = document.querySelectorAll("[data-edge-blocker]");
const inventoryPanel = document.querySelector("[data-inventory-panel]");
const inventoryList = document.querySelector("[data-inventory-list]");
const inventoryEmpty = document.querySelector("[data-inventory-empty]");
const pickupPrompt = document.querySelector("[data-pickup-prompt]");
const pickupMessage = document.querySelector("[data-pickup-message]");
const meadowRestPanel = document.querySelector("[data-meadow-rest]");
const trollSprite = document.querySelector("[data-troll-sprite]");
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
const FIXED_ATTRIBUTES = new Set(["Experience", "Health", "Mana"]);
const EMPTY_CELL = "XXXXXXXXXXX";
const TOWN_CELL = "Town";
const DRAGON_ALTAR_CELL = "Dragon Stone Altar";
const HEALER_HUT_CELL = "Healer Hut";
const WITCH_CELL = "Witch";
const HALL_OF_SHADOWS_CELL = "Hall of Shadows";
const AMULET_OF_SHADOWS = "Amulet of Shadows";
const SWAMP_LATERN_CELL = "Swamp/Latern";
const LATERN_ITEM = "Latern";
const MEADOW_CELL = "Meadow";
const TROLL_CELL = "Troll";
const TEMPLE_CELL = "Temple";
const DARK_WIZARD_CASTLE_CELL = "Dark Wizard Castle";
const ORB_OF_THE_DRAGON = "Orb of the Dragon";
const EXIT_THRESHOLD = 6;
const HEALER_HUT_DOOR_ZONE = { id: "healer-hut-door", type: "rect", x: 44, y: 44, width: 12, height: 18 };
const HEALER_INTERIOR_EXIT_ZONE = { id: "healer-hut-exit", type: "rect", x: 42, y: 83, width: 16, height: 17 };
const WITCH_DOOR_ZONE = { id: "witch-cottage-door", type: "rect", x: 47, y: 42, width: 8, height: 15 };
const HALL_OF_SHADOWS_DOOR_ZONE = { id: "hall-of-shadows-door", type: "rect", x: 43, y: 38, width: 14, height: 23 };
const LATERN_PICKUP_ZONE = { id: "latern-pickup", type: "rect", x: 51, y: 30, width: 8, height: 18 };
const TROLL_START_POSITION = { x: 20, y: 46 };
const DARK_WIZARD_SNOW_ZONE = { id: "dark-wizard-snow", type: "rect", x: 0, y: 0, width: 100, height: 47 };
const START_GRID_POSITION = { row: 12, col: 5 };
const START_SCENE_POSITION = { x: 50, y: 78 };
const OPPOSITE_DIRECTIONS = {
  north: "south",
  east: "west",
  south: "north",
  west: "east",
};
const DIRECTION_DELTAS = {
  north: { row: -1, col: 0 },
  east: { row: 0, col: 1 },
  south: { row: 1, col: 0 },
  west: { row: 0, col: -1 },
};
const ENTRY_POINTS = {
  north: { x: 50, y: 10 },
  east: { x: 90, y: 74 },
  south: { x: 50, y: 90 },
  west: { x: 10, y: 74 },
};
const GAME_GRID = [
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  ["Dark Wizard Castle", EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, "Woods", EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  ["Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Woods", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains"],
  ["Troll", "Swamp", "Swamp", "Swamp", "Woods", "Woods", "Meadow", "Woods", "Woods", "Woods", "Mountains"],
  ["Swamp", "Swamp", "Witch", "Swamp", "Woods", "Woods", "Woods", "Healer Hut", "Woods", "Woods", "Mountains"],
  [EMPTY_CELL, "Swamp", "Swamp", "Swamp", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Mountains"],
  [EMPTY_CELL, "Swamp", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Hall of Shadows"],
  [EMPTY_CELL, "Swamp/Latern", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Mountains"],
  [EMPTY_CELL, "Swamp", "Woods", "Woods", "Woods", "Town", "Woods", "Woods", "Woods", "Woods", "Mountains"],
  ["Mountains", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Mountains"],
  ["Mountains", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Woods", "Temple", "Mountains"],
  ["Mountains", "Woods", "Woods", "Woods", "Woods", "Dragon Stone Altar", "Woods", "Woods", "Woods", "Woods", "Mountains"],
  ["Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains", "Mountains"],
];
const SCENE_TEMPLATES = {
  woods: {
    title: "Deep Woods",
    cssClass: "scene-woods",
    blockedZones: [],
  },
  swamp: {
    title: "Mistwood Swamp",
    cssClass: "scene-swamp",
    blockedZones: [],
  },
  swampLatern: {
    title: "Swamp Latern",
    cssClass: "scene-swamp-latern",
    blockedZones: [
      { id: "latern-island", type: "ellipse", x: 51, y: 57, radiusX: 18, radiusY: 9 },
      { id: "dead-tree-trunk", type: "rect", x: 47, y: 31, width: 8, height: 28 },
    ],
  },
  meadow: {
    title: "Willow Meadow",
    cssClass: "scene-meadow",
    safe: true,
    blockedZones: [
      { id: "willow-trunk", type: "rect", x: 47, y: 24, width: 8, height: 31 },
    ],
  },
  troll: {
    title: "Troll Bog",
    cssClass: "scene-troll",
    blockedZones: [
      { id: "troll-island", type: "ellipse", x: 22, y: 44, radiusX: 18, radiusY: 12 },
      { id: "treasure-chest", type: "rect", x: 23, y: 38, width: 10, height: 7 },
    ],
  },
  temple: {
    title: "Ancient Temple",
    cssClass: "scene-temple",
    blockedZones: [
      { id: "temple-left-wing", type: "rect", x: 22, y: 24, width: 19, height: 30 },
      { id: "temple-right-wing", type: "rect", x: 59, y: 24, width: 19, height: 30 },
      { id: "temple-pediment", type: "rect", x: 20, y: 16, width: 60, height: 16 },
    ],
  },
  darkWizard: {
    title: "Dark Wizard Castle",
    cssClass: "scene-dark-wizard",
    blockedZones: [],
  },
  mountains: {
    title: "Mountain Pass",
    cssClass: "scene-mountains",
    blockedZones: [
      { id: "mountain-left-ridge", type: "rect", x: 0, y: 0, width: 9, height: 100 },
      { id: "mountain-right-ridge", type: "rect", x: 91, y: 0, width: 9, height: 100 },
      { id: "mountain-upper-ridge", type: "rect", x: 0, y: 0, width: 100, height: 10 },
    ],
  },
  clearing: {
    title: "Vale of Thurindore",
    cssClass: "scene-clearing",
    blockedZones: [
      { id: "dragon-stone", type: "ellipse", x: 53, y: 38, radiusX: 20, radiusY: 15 },
    ],
  },
  dragonAltar: {
    title: "Dragon Stone Altar",
    cssClass: "scene-dragon-altar",
    blockedZones: [
      { id: "altar-slab", type: "ellipse", x: 50, y: 54, radiusX: 16, radiusY: 8 },
      { id: "fallen-stone-left", type: "rect", x: 27, y: 37, width: 10, height: 20 },
      { id: "fallen-stone-right", type: "rect", x: 64, y: 36, width: 10, height: 21 },
    ],
  },
  healerHut: {
    title: "Healer Hut",
    cssClass: "scene-healer-hut",
    blockedZones: [
      { id: "healer-hut-house-left", type: "rect", x: 28, y: 24, width: 16, height: 39 },
      { id: "healer-hut-house-right", type: "rect", x: 56, y: 24, width: 16, height: 39 },
      { id: "healer-hut-roof", type: "rect", x: 25, y: 19, width: 50, height: 20 },
    ],
  },
  healerInterior: {
    title: "Inside the Healer Hut",
    cssClass: "scene-healer-interior",
    blockedZones: [
      { id: "healer-counter", type: "rect", x: 60, y: 42, width: 28, height: 28 },
      { id: "healer-hearth", type: "rect", x: 10, y: 38, width: 22, height: 28 },
      { id: "healer-left-shelf", type: "rect", x: 4, y: 8, width: 30, height: 18 },
      { id: "healer-right-shelf", type: "rect", x: 61, y: 8, width: 34, height: 18 },
    ],
  },
  witch: {
    title: "Witch's Cottage",
    cssClass: "scene-witch",
    blockedZones: [
      { id: "witch-cottage-left", type: "rect", x: 29, y: 23, width: 18, height: 36 },
      { id: "witch-cottage-right", type: "rect", x: 54, y: 23, width: 18, height: 36 },
      { id: "witch-cottage-roof", type: "rect", x: 26, y: 16, width: 49, height: 20 },
      WITCH_DOOR_ZONE,
    ],
  },
  hallOfShadows: {
    title: "Hall of Shadows",
    cssClass: "scene-hall-shadows",
    blockedZones: [
      { id: "hall-monolith-left", type: "rect", x: 28, y: 17, width: 15, height: 50 },
      { id: "hall-monolith-right", type: "rect", x: 57, y: 17, width: 15, height: 50 },
      { id: "hall-monolith-cap", type: "rect", x: 31, y: 13, width: 38, height: 13 },
      HALL_OF_SHADOWS_DOOR_ZONE,
    ],
  },
};
const ATTRIBUTE_GROUPS = {
  left: [
    "Strength",
    "Intelligence",
    "Agility",
    "Vitality",
    "Luck",
    "Magic",
    "Experience",
  ],
  right: [
    "Weapon Use",
    "Parry",
    "Dodge",
    "Stealth",
    "Throwing",
    "Climbing",
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
    "Weapon Use": 85,
    Parry: 85,
    Dodge: 70,
    Stealth: 40,
    Throwing: 70,
    Climbing: 60,
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
    "Weapon Use": 40,
    Parry: 40,
    Dodge: 60,
    Stealth: 60,
    Throwing: 40,
    Climbing: 40,
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
    "Weapon Use": 60,
    Parry: 60,
    Dodge: 75,
    Stealth: 85,
    Throwing: 60,
    Climbing: 80,
    Health: 100,
    Stamina: 65,
    Mana: 10,
  },
};

let baseAttributes = {};
let currentAttributes = {};
let remainingPoints = POINT_POOL;
let selectedCharacterCard = null;
let currentGridPosition = { ...START_GRID_POSITION };
let playerPosition = { ...START_SCENE_POSITION };
let currentSceneTemplate = SCENE_TEMPLATES.clearing;
let isInsideHealerHut = false;
const inventory = [];
let playerHealth = { current: 0, max: 0 };
let trollPosition = { ...TROLL_START_POSITION };

function showScreen(screenToShow) {
  [titleScreen, selectionScreen, attributeScreen, introScreen, gameScreen].forEach((screen) => {
    const isActive = screen === screenToShow;
    screen.hidden = !isActive;
    screen.classList.toggle("is-active", isActive);
  });
}

function renderAttributeRow(attributeName) {
  const row = document.createElement("div");
  row.className = "attribute-row";
  row.classList.toggle("is-readonly", FIXED_ATTRIBUTES.has(attributeName));

  const label = document.createElement("span");
  label.className = "attribute-name";
  label.textContent = attributeName;

  const value = document.createElement("span");
  value.className = "attribute-value";
  value.dataset.attributeValue = attributeName;
  value.textContent = currentAttributes[attributeName];

  if (FIXED_ATTRIBUTES.has(attributeName)) {
    row.title = `${attributeName} is fixed and cannot be changed.`;
    row.append(label, value);
    return row;
  }

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

  selectedCharacterCard = card;
  uniquifySvgIds(portrait, `attribute-${character.toLowerCase()}`);
  selectedClass.textContent = character;
  selectedPortrait.replaceChildren(portrait);
  baseAttributes = { ...CLASS_STARTS[character] };
  currentAttributes = { ...CLASS_STARTS[character] };
  remainingPoints = POINT_POOL;
  renderAttributes();
  showScreen(attributeScreen);
}

function renderPlayerSprite() {
  const sourceCard = selectedCharacterCard || characterCards[0];
  const character = sourceCard.dataset.character;
  const characterArt = sourceCard.querySelector(".character").cloneNode(true);

  characterArt.classList.add("game-character-art");
  uniquifySvgIds(characterArt, `game-${character.toLowerCase()}`);
  playerSprite.setAttribute("aria-label", `${character} hero`);
  playerSprite.replaceChildren(characterArt);
}

function renderInventory() {
  inventoryList.replaceChildren(...inventory.map((item) => {
    const itemNode = document.createElement("li");
    itemNode.textContent = item;
    return itemNode;
  }));
  inventoryEmpty.hidden = inventory.length > 0;
}

function addInventoryItem(item) {
  if (inventory.includes(item)) {
    return;
  }

  inventory.push(item);
  renderInventory();
}

function hasInventoryItem(item) {
  return inventory.includes(item);
}

function toggleInventory(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : inventoryPanel.hidden;
  inventoryPanel.hidden = !shouldOpen;
}

function initializePlayerHealth() {
  playerHealth.max = currentAttributes.Health || 100;
  playerHealth.current = playerHealth.max;
}

function getCell(position) {
  return GAME_GRID[position.row]?.[position.col] || EMPTY_CELL;
}

function isExistingCell(position) {
  return getCell(position) !== EMPTY_CELL;
}

function getSceneType(cell) {
  if (cell === DRAGON_ALTAR_CELL) {
    return "dragonAltar";
  }

  if (cell === SWAMP_LATERN_CELL) {
    return "swampLatern";
  }

  if (cell === MEADOW_CELL) {
    return "meadow";
  }

  if (cell === TROLL_CELL) {
    return "troll";
  }

  if (cell === TEMPLE_CELL) {
    return "temple";
  }

  if (cell === DARK_WIZARD_CASTLE_CELL) {
    return "darkWizard";
  }

  if (cell === HALL_OF_SHADOWS_CELL) {
    return "hallOfShadows";
  }

  if (cell === HEALER_HUT_CELL) {
    return "healerHut";
  }

  if (cell === WITCH_CELL) {
    return "witch";
  }

  if (cell === "Mountains") {
    return "mountains";
  }

  if (cell.includes("Swamp")) {
    return "swamp";
  }

  if (cell.includes("Woods") || cell === "Town") {
    return "woods";
  }

  return "clearing";
}

function getCurrentSceneName() {
  return getCell(currentGridPosition);
}

function getNeighborPosition(direction) {
  const delta = DIRECTION_DELTAS[direction];

  return {
    row: currentGridPosition.row + delta.row,
    col: currentGridPosition.col + delta.col,
  };
}

function canEnterCell(position, direction) {
  const cell = getCell(position);

  if (cell === TOWN_CELL) {
    return direction === "north";
  }

  return isExistingCell(position);
}

function canLeaveCurrentCell(direction) {
  const cell = getCurrentSceneName();

  if (cell === TOWN_CELL) {
    return direction === "south";
  }

  return true;
}

function getBlockedDirections() {
  if (isInsideHealerHut) {
    return [];
  }

  return Object.keys(DIRECTION_DELTAS).filter((direction) => {
    const nextPosition = getNeighborPosition(direction);

    return !canLeaveCurrentCell(direction) || !canEnterCell(nextPosition, direction);
  });
}

function renderScene() {
  const cell = getCurrentSceneName();
  const sceneType = isInsideHealerHut ? "healerInterior" : getSceneType(cell);
  const template = SCENE_TEMPLATES[sceneType];
  const blockedDirections = getBlockedDirections();

  hidePickupPrompt();
  meadowRestPanel.hidden = sceneType !== "meadow";
  currentSceneTemplate = template;
  adventureScene.classList.remove(
    "scene-woods",
    "scene-swamp",
    "scene-mountains",
    "scene-clearing",
    "scene-dragon-altar",
    "scene-healer-hut",
    "scene-healer-interior",
    "scene-witch",
    "scene-hall-shadows",
    "scene-swamp-latern",
    "scene-meadow",
    "scene-troll",
    "scene-temple",
    "scene-dark-wizard",
  );
  adventureScene.classList.add(template.cssClass);
  adventureScene.classList.toggle("has-latern", hasInventoryItem(LATERN_ITEM));
  resetTrollSprite();
  sceneTitle.textContent = isInsideHealerHut || cell === "Woods" || cell === "Swamp" || cell === "Mountains" || cell === MEADOW_CELL || cell === TROLL_CELL || cell === TEMPLE_CELL || cell === DARK_WIZARD_CASTLE_CELL
    ? template.title
    : cell;
  gridLocation.textContent = isInsideHealerHut
    ? "Inside the cottage"
    : `Grid ${currentGridPosition.row + 1}, ${currentGridPosition.col + 1}`;
  adventureScene.setAttribute("aria-label", `${sceneTitle.textContent}. Click a clear spot to move.`);

  edgeBlockers.forEach((blocker) => {
    blocker.hidden = !blockedDirections.includes(blocker.dataset.edgeBlocker);
  });
}

function placePlayer(point, shouldAnimate = true) {
  const distance = Math.hypot(point.x - playerPosition.x, point.y - playerPosition.y);
  const duration = shouldAnimate ? Math.min(Math.max(distance * 18, 220), 1200) : 0;

  playerPosition = point;
  playerSprite.style.setProperty("--walk-duration", `${duration}ms`);
  playerSprite.style.left = `${point.x}%`;
  playerSprite.style.top = `${point.y}%`;
  playerMarker.style.left = `${point.x}%`;
  playerMarker.style.top = `${point.y}%`;
}

function resetTrollSprite() {
  trollPosition = { ...TROLL_START_POSITION };
  trollSprite.style.setProperty("--troll-duration", "0ms");
  trollSprite.style.left = `${TROLL_START_POSITION.x}%`;
  trollSprite.style.top = `${TROLL_START_POSITION.y}%`;
}

function moveTrollTowardPlayer() {
  if (getCurrentSceneName() !== TROLL_CELL) {
    return;
  }

  const distance = Math.hypot(playerPosition.x - trollPosition.x, playerPosition.y - trollPosition.y);
  const duration = Math.min(Math.max(distance * 18, 220), 1200);

  trollSprite.style.setProperty("--troll-duration", `${duration}ms`);
  trollPosition = { ...playerPosition };
  requestAnimationFrame(() => {
    trollSprite.style.left = `${playerPosition.x}%`;
    trollSprite.style.top = `${playerPosition.y}%`;
  });
}

function startFirstScene() {
  currentGridPosition = { ...START_GRID_POSITION };
  playerPosition = { ...START_SCENE_POSITION };
  isInsideHealerHut = false;
  initializePlayerHealth();
  renderPlayerSprite();
  renderScene();
  placePlayer({ ...START_SCENE_POSITION }, false);
  movementStatus.textContent = "Click within the scene to walk, or click an edge to travel.";
  showScreen(gameScreen);
}

function getScenePoint(event) {
  const rect = adventureScene.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  };
}

function getExitDirection(point) {
  if (point.y <= EXIT_THRESHOLD) {
    return "north";
  }

  if (point.x >= 100 - EXIT_THRESHOLD) {
    return "east";
  }

  if (point.y >= 100 - EXIT_THRESHOLD) {
    return "south";
  }

  if (point.x <= EXIT_THRESHOLD) {
    return "west";
  }

  return null;
}

function isPointInBlockedZone(point, zone) {
  if (zone.type === "rect") {
    return point.x >= zone.x
      && point.x <= zone.x + zone.width
      && point.y >= zone.y
      && point.y <= zone.y + zone.height;
  }

  if (zone.type === "ellipse") {
    const normalizedX = (point.x - zone.x) / zone.radiusX;
    const normalizedY = (point.y - zone.y) / zone.radiusY;
    return (normalizedX * normalizedX) + (normalizedY * normalizedY) <= 1;
  }

  return false;
}

function isBlockedPoint(point) {
  return point.x < 0
    || point.x > 100
    || point.y < 0
    || point.y > 100
    || currentSceneTemplate.blockedZones.some((zone) => isPointInBlockedZone(point, zone));
}

function enterHealerHut() {
  isInsideHealerHut = true;
  renderScene();
  placePlayer({ x: 50, y: 82 }, false);
  movementStatus.textContent = "The healer's door opens. You step into the warm cottage.";
}

function leaveHealerHut() {
  isInsideHealerHut = false;
  renderScene();
  placePlayer({ x: 50, y: 68 }, false);
  movementStatus.textContent = "You step back outside the Healer Hut.";
}

function tryEnterWitchCottage() {
  if (!hasInventoryItem("Witches' Key")) {
    movementStatus.textContent = "The witch's door is locked. You need the Witches' Key.";
    return;
  }

  movementStatus.textContent = "The Witches' Key turns in the lock, but the cottage interior is not ready yet.";
}

function tryApproachHallOfShadows() {
  if (!hasInventoryItem(AMULET_OF_SHADOWS)) {
    movementStatus.textContent = "A cold force pushes you back. You need the Amulet of Shadows to approach the open door.";
    return;
  }

  placePlayer({ x: 50, y: 61 });
  movementStatus.textContent = "The Amulet of Shadows glows as you approach the open door.";
}

function showPickupPrompt(message) {
  pickupMessage.textContent = message;
  pickupPrompt.hidden = false;
}

function hidePickupPrompt() {
  pickupPrompt.hidden = true;
}

function takeLatern() {
  addInventoryItem(LATERN_ITEM);
  hidePickupPrompt();
  adventureScene.classList.add("has-latern");
  movementStatus.textContent = "You take the Latern and place it in your inventory.";
  toggleInventory(true);
}

function sleepInMeadow() {
  const restoreAmount = Math.ceil(playerHealth.max * 0.5);
  const beforeSleep = playerHealth.current;
  playerHealth.current = Math.min(playerHealth.max, playerHealth.current + restoreAmount);

  if (playerHealth.current === beforeSleep) {
    movementStatus.textContent = "You sleep beneath the willow. This meadow is safe, and your health is already full.";
    return;
  }

  movementStatus.textContent = `You sleep beneath the willow. This safe meadow restores your health to ${playerHealth.current}/${playerHealth.max}.`;
}

function handleDarkWizardSnow(point) {
  if (getCurrentSceneName() !== DARK_WIZARD_CASTLE_CELL || !isPointInBlockedZone(point, DARK_WIZARD_SNOW_ZONE)) {
    return false;
  }

  if (hasInventoryItem(ORB_OF_THE_DRAGON)) {
    return false;
  }

  placePlayer({ x: point.x, y: 58 });
  movementStatus.textContent = "A mysterious force drives you back.";
  return true;
}

function attemptGridMove(direction) {
  if (isInsideHealerHut) {
    movementStatus.textContent = "The cottage walls keep you inside. Use the doorway to leave.";
    return;
  }

  const nextPosition = getNeighborPosition(direction);

  if (!canLeaveCurrentCell(direction) || !canEnterCell(nextPosition, direction)) {
    movementStatus.textContent = "That direction is blocked by impassable terrain.";
    return;
  }

  currentGridPosition = nextPosition;
  renderScene();
  placePlayer(ENTRY_POINTS[OPPOSITE_DIRECTIONS[direction]], false);
  movementStatus.textContent = `You enter ${getCurrentSceneName()}.`;
  moveTrollTowardPlayer();
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
      if (remainingPoints === 0) {
        showScreen(introScreen);
        return;
      }

      allocationStatus.textContent = `Allocate all points to continue: ${remainingPoints} remaining.`;
      return;
    }

    if (button.dataset.action === "enter-vale") {
      startFirstScene();
      return;
    }

    if (button.dataset.action === "toggle-inventory") {
      toggleInventory();
      return;
    }

    if (button.dataset.action === "close-inventory") {
      toggleInventory(false);
      return;
    }

    if (button.dataset.action === "take-latern") {
      takeLatern();
      return;
    }

    if (button.dataset.action === "sleep-meadow") {
      sleepInMeadow();
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

adventureScene.addEventListener("click", (event) => {
  if (event.target.closest("[data-action]")) {
    return;
  }

  const point = getScenePoint(event);

  if (isInsideHealerHut) {
    if (isPointInBlockedZone(point, HEALER_INTERIOR_EXIT_ZONE)) {
      leaveHealerHut();
      return;
    }

    if (isBlockedPoint(point)) {
      movementStatus.textContent = "Shelves and furniture block that spot.";
      return;
    }

    placePlayer(point);
    movementStatus.textContent = "Your hero walks across the healer's cozy cottage.";
    return;
  }

  const exitDirection = getExitDirection(point);

  if (exitDirection) {
    attemptGridMove(exitDirection);
    return;
  }

  if (getCurrentSceneName() === WITCH_CELL && isPointInBlockedZone(point, WITCH_DOOR_ZONE)) {
    tryEnterWitchCottage();
    return;
  }

  if (getCurrentSceneName() === HALL_OF_SHADOWS_CELL && isPointInBlockedZone(point, HALL_OF_SHADOWS_DOOR_ZONE)) {
    tryApproachHallOfShadows();
    return;
  }

  if (
    getCurrentSceneName() === SWAMP_LATERN_CELL
    && !hasInventoryItem(LATERN_ITEM)
    && isPointInBlockedZone(point, LATERN_PICKUP_ZONE)
  ) {
    showPickupPrompt("Take Latern");
    movementStatus.textContent = "A Latern hangs from the dead tree.";
    return;
  }

  if (handleDarkWizardSnow(point)) {
    return;
  }

  if (isBlockedPoint(point)) {
    movementStatus.textContent = "That way is blocked. Choose a clear path.";
    return;
  }

  hidePickupPrompt();
  placePlayer(point);
  if (getCurrentSceneName() === TROLL_CELL) {
    moveTrollTowardPlayer();
    movementStatus.textContent = "The massive troll lumbers straight toward you.";
    return;
  }

  if (getCurrentSceneName() === HEALER_HUT_CELL && isPointInBlockedZone(point, HEALER_HUT_DOOR_ZONE)) {
    enterHealerHut();
    return;
  }

  movementStatus.textContent = `Your hero moves through ${getCurrentSceneName()}.`;
});

renderInventory();
