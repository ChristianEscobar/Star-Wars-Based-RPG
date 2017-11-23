/* Character objects */
var lukeSkywalker = {
	name: 'Luke Skywalker',
	baseAttackPower: 6,
	healthPoints: 100,
	attackPower: 6,
	counterAttackPower: 2,
	selectedAsFighter: false,
	selectedAsDefender: false,
	id: '#luke-skywalker',
	selectedAudioId: '#lightsaber-on',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var darthVader = {
	name: 'Darth Vader',
	baseAttackPower: 8,
	healthPoints: 100,
	attackPower: 8,
	counterAttackPower: 2,
	selectedAsFighter: false,
	selectedAsDefender: false,
	id: '#darth-vader',
	selectedAudioId: '#darth-vader-breathing',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var obiWan = {
	name: 'Obi-Wan Kenobi',
	baseAttackPower: 10,
	healthPoints: 120,
	attackPower: 10,
	counterAttackPower: 4,
	selectedAsFighter: false,
	selectedAsDefender: false,
	id: '#obi-wan',
	selectedAudioId: '#lightsaber-on',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var emperorPalpatine = {
	name: 'Emperor Palpatine',
	baseAttackPower: 12,
	healthPoints: 150,
	attackPower: 12,
	counterAttackPower: 6,
	selectedAsFighter: false,
	selectedAsDefender: false,
	id: '#palpatine',
	selectedAudioId: '#palpatine-good',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

/* Global variables */
var characterObjects = [lukeSkywalker, darthVader, obiWan, emperorPalpatine];
var userHasSelectedFighter = false;
var userHasSelectedEnemy = false;

/* Event listeners */
$('#luke-skywalker').on('click', function() {
	characterClicked(this, lukeSkywalker);
});

$('#darth-vader').on('click', function() {
	characterClicked(this, darthVader);
});

$('#obi-wan').on('click', function() {
	characterClicked(this, obiWan);
});

$('#palpatine').on('click', function() {
	characterClicked(this, emperorPalpatine);
});

/* Entry point */
function startGame() {
	setupCharacterStats();

	return;
}

/* Helper functions */
function setupCharacterStats() {
	for(var i=0; i<characterObjects.length; i++) {
		var currentObject = characterObjects[i];

		$(currentObject.id + ' .panel-heading').html(currentObject.name);
		$(currentObject.id + ' .panel-footer').html(currentObject.healthPoints);
	}

	return;
}

// This function is used to determine if a clicked character
// needs to be placed in the selected figther section or the
// defender section
function characterClicked(characterElement, characterObject) {
	if(!userHasSelectedFighter) {
		$('#selected-character').append(characterElement);

		characterObject.selectedAsFighter = true;

		userHasSelectedFighter = true;

		// Play selected sound
		$(characterObject.selectedAudioId)[0].play();

		populateAvailableEnemies();
	}
	else if(!userHasSelectedEnemy) {
		$('#enemy-selected').append(characterElement);

		characterObject.selectedAsDefender = true;

		userHasSelectedEnemy = true;

		shiftAvailableEnemies();
	}

	return;
}

// Loops through the character array object and if the objecxt has not
// been selected by the user as their fighter
// it will place it in the available enemies section of the page
function populateAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i<characterObjects.length; i++) {
		var currentObject = characterObjects[i];
		
		if(!currentObject.selectedAsFighter) {
			var elementId = '#available-enemies-' + elementIdCounter;
			$(elementId).append($(currentObject.id));

			elementIdCounter++;
		}
	}

	return;
}

// Shifts available enemy panels to ensure no empty slots are displayed
function shiftAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i<characterObjects.length; i++) {
		var currentObject = characterObjects[i];

		if(!currentObject.selectedAsDefender && !currentObject.selectedAsFighter) {
			var elementId = '#available-enemies-' + elementIdCounter;

			$(elementId).append($(currentObject.id));

			elementIdCounter++;
		}
	}

	return;
}