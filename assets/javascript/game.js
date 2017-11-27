/* Character objects */
var lukeSkywalker = {
	name: 'Luke Skywalker',
	selectedAsFighter: false,
	selectedAsDefender: false,
	hasBeenDefeated: false,
	baseAttackPower: 6,
	healthPoints: 100,
	attackPower: 6,
	counterAttackPower: 2,
	id: '#luke-skywalker',
	selectedAudioId: '#lightsaber-on',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var darthVader = {
	name: 'Darth Vader',
	selectedAsFighter: false,
	selectedAsDefender: false,
	hasBeenDefeated: false,
	baseAttackPower: 8,
	healthPoints: 100,
	attackPower: 8,
	counterAttackPower: 2,
	id: '#darth-vader',
	selectedAudioId: '#darth-vader-breathing',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var obiWan = {
	name: 'Obi-Wan Kenobi',
	selectedAsFighter: false,
	selectedAsDefender: false,
	hasBeenDefeated: false,
	baseAttackPower: 10,
	healthPoints: 120,
	attackPower: 10,
	counterAttackPower: 4,
	id: '#obi-wan',
	selectedAudioId: '#lightsaber-on',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

var emperorPalpatine = {
	name: 'Emperor Palpatine',
	selectedAsFighter: false,
	selectedAsDefender: false,
	hasBeenDefeated: false,
	baseAttackPower: 12,
	healthPoints: 150,
	attackPower: 12,
	counterAttackPower: 6,
	id: '#palpatine',
	selectedAudioId: '#palpatine-good',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

/* Global variables */
var allCharacterObjects = [lukeSkywalker, darthVader, obiWan, emperorPalpatine];
var selectedFighterObj;
var selectedDefenderObj;

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

$('#attack-button').on('click', function() {
	attack();
});

/* Functions */

// Game entry point function
function startGame() {
	displayCharacterStats(null);

	return;
}

// Displays stats on the character panel using the provided character object array.
// Pass in null if using the global character array
function displayCharacterStats(charactersArray) {
	var loopOnThisArray = null;

	if(charactersArray === null) {
		loopOnThisArray = allCharacterObjects;
	} else {
		loopOnThisArray = charactersArray;
	}

	for(var i=0; i<loopOnThisArray.length; i++) {
		var currentObject = loopOnThisArray[i];

		$(currentObject.id + ' .panel-heading').html(currentObject.name);
		$(currentObject.id + ' .panel-footer').html(currentObject.healthPoints);
	}

	return;
}

// This function is used to determine if a clicked character
// needs to be placed in the selected fighter section or the
// defender section
function characterClicked(characterElement, characterObject) {
	if(typeof selectedFighterObj === 'undefined') {
		$('#selected-character').empty();

		/* Remove orange shadow */
		$(characterElement).removeClass('element-orange-box-shadow');

		/* Add green shadow to identify as current */
		$(characterElement).addClass('element-green-box-shadow');

		$('#selected-character').append(characterElement);

		characterObject.selectedAsFighter = true;

		selectedFighterObj = characterObject;

		// Play selected sound
		$(characterObject.selectedAudioId)[0].play();

		populateAvailableEnemies();

		// Enable attack button
		$('#attack-button').prop('disabled', false);
	}
	// The hasBeenDefeated flag is checked to handle cases when a user is selecting a new enemy
	// after having defeated one
	else if(typeof selectedDefenderObj === 'undefined' || selectedDefenderObj.hasBeenDefeated) {
		$('#enemy-selected').empty();

		$('#vs-text').fadeIn('slow');

		/* Remove red shadow because this character is now a defender */
		$(characterElement).removeClass('element-red-box-shadow');

		/* Add green shadow to identify as current */
		$(characterElement).addClass('element-green-box-shadow');

		characterObject.selectedAsDefender = true;

		$('#enemy-selected').append(characterElement);

		selectedDefenderObj = characterObject;

		// Play selected sound
		$(characterObject.selectedAudioId)[0].play();

		shiftAvailableEnemies();
	}

	return;
}

// Loops through the character array object and if the objecxt has not
// been selected by the user as their fighter
// it will place it in the available enemies section of the page
function populateAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i<allCharacterObjects.length; i++) {
		var currentObject = allCharacterObjects[i];
		
		// Only display the remaining characters after the user has selected their fighter.
		// If a characters has been defeated, it should not be displayed.
		if(!currentObject.selectedAsFighter && !currentObject.hasBeenDefeated) {
			var elementId = '#available-enemies-' + elementIdCounter;

			/* Remove orange shadow */
			$(currentObject.id).removeClass('element-orange-box-shadow');

			/* Add shadow class */
			$(currentObject.id).addClass(('element-red-box-shadow'));

			$(elementId).append($(currentObject.id));

			elementIdCounter++;
		}
	}

	return;
}

// Shifts available enemy panels to ensure no empty slots are displayed
function shiftAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i<allCharacterObjects.length; i++) {
		var currentObject = allCharacterObjects[i];

		// Only work with characters that have not been defeated yet
		if(!currentObject.selectedAsDefender && !currentObject.selectedAsFighter && !currentObject.hasBeenDefeated) {
			var elementId = '#available-enemies-' + elementIdCounter;

			$(elementId).append($(currentObject.id));

			elementIdCounter++;
		}
	}

	return;
}

// Executes attack logic
function attack() {
	var attackMessages = $('#attack-messages');

	// start by checking if a defender has been selected
	// if a defender has not been selected, display a message
	if(typeof selectedDefenderObj === 'undefined' || selectedDefenderObj.hasBeenDefeated) {
		attackMessages.empty();
		attackMessages.append("You have not selected a defender!");
	} else {
		// Play attack sound
		$('#light-saber-clash')[0].play();

		attackMessages.empty();

		// Subtract from enemy health points
		selectedDefenderObj.healthPoints -= selectedFighterObj.attackPower;

		attackMessages.append('You attacked ' + selectedDefenderObj.name + ' for ' + selectedFighterObj.attackPower + ' damage.<br>');

		// Increase selected fighter attack power
		selectedFighterObj.attackPower += selectedFighterObj.baseAttackPower;

		// Subtract from selected fighter health points
		selectedFighterObj.healthPoints -= selectedDefenderObj.counterAttackPower

		attackMessages.append(selectedDefenderObj.name + ' attacked you for ' + selectedDefenderObj.counterAttackPower + ' damage.');

		displayCharacterStats([selectedFighterObj, selectedDefenderObj]);

		// Check if user has won this fight
		if(hasUserWon()) {
			attackMessages.empty();
			attackMessages.append('You have defeated ' + selectedDefenderObj.name + '.<br>Choose another enemy to fight!');

			clearDefender();
		} 
		else if(hasUserLost()) {
			attackMessages.append('You have been defeated!');

			// TODO
			// display a restart game button
			// add logic to restart the game
		}
	}

	return;
}

// Checks if the user is a winner
function hasUserWon() {
	if(selectedFighterObj.healthPoints > 0 && selectedDefenderObj.healthPoints <= 0) {
		return true;
	}

	return false;
}

// Checks if the user has lost
function hasUserLost() {
	if(selectedFighterObj.healthPoints <= 0 && selectedDefenderObj.healthPoints > 0) {
		return true;
	}

	return false;
}

// Clears the defender panel
function clearDefender() {
	selectedDefenderObj.hasBeenDefeated = true;

	//console.log(allCharacterObjects);

	$('#enemy-selected').empty();

	$('#vs-text').fadeOut('slow');

	return;
}