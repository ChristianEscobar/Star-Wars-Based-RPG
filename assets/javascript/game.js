/* Character objects */
var lukeSkywalker = {
	name: 'Luke Skywalker',
	baseAttackPower: 6,
	healthPoints: 100,
	attackPower: 6,
	counterAttackPower: 2,
	selected: false,
	id: '#luke-skywalker',
};

var darthVader = {
	name: 'Darth Vader',
	baseAttackPower: 8,
	healthPoints: 100,
	attackPower: 8,
	counterAttackPower: 2,
	selected: false,
	id: '#darth-vader',
};

var obiWan = {
	name: 'Obi-Wan Kenobi',
	baseAttackPower: 10,
	healthPoints: 120,
	attackPower: 10,
	counterAttackPower: 4,
	selected: false,
	id: '#obi-wan',
};

var emperorPalpatine = {
	name: 'Emperor Palpatine',
	baseAttackPower: 12,
	healthPoints: 150,
	attackPower: 12,
	counterAttackPower: 6,
	selected: false,
	id: '#palpatine',
};

/* Global variables */
var characterObjects = [lukeSkywalker, darthVader, obiWan, emperorPalpatine];

/* Event listeners */
$("#luke-skywalker").on("click", function() {
	$("#selected-character").append(this);
	lukeSkywalker.selected = true;

	populateAvailableEnemies();
});

$("#darth-vader").on("click", function() {
	$("#selected-character").append(this);
	darthVader.selected = true;

	populateAvailableEnemies();
});

$("#obi-wan").on("click", function() {
	$("#selected-character").append(this);
	obiWan.selected = true;

	populateAvailableEnemies();
});

$("#palpatine").on("click", function() {
	$("#selected-character").append(this);
	emperorPalpatine.selected = true;

	populateAvailableEnemies();
});

/* Helper functions */

// Loops through the character array object and if the objecxt has not been selected
// it will place it in the available enemies section of the page
function populateAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i < characterObjects.length; i++) {
		var currentObject = characterObjects[i];
		
		if(!currentObject.selected) {
			var elementId = "#available-enemies-" + elementIdCounter;
			$(elementId).append($(currentObject.id));

			elementIdCounter++;
		}
	}

	return;
}