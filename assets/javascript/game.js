/* Character objects */
var lukeSkywalker = {
	name: 'Luke Skywalker',
	selectedAsFighter: false,
	selectedAsDefender: false,
	hasBeenDefeated: false,
	baseAttackPower: 10,
	healthPoints: 100,
	attackPower: 10,
	counterAttackPower: 5,
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
	baseAttackPower: 10,
	healthPoints: 180,
	attackPower: 10,
	counterAttackPower: 25,
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
	baseAttackPower: 8,
	healthPoints: 120,
	attackPower: 8,
	counterAttackPower: 13,
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
	counterAttackPower: 20,
	id: '#palpatine',
	selectedAudioId: '#palpatine-good',
	increaseAttackPower: function() {
		this.attackPower += this.baseAttackPower;
	},
};

/* Global variables */
var _allCharacterObjects = [lukeSkywalker, darthVader, obiWan, emperorPalpatine];
var _availableEnemyObjects = [];
var _selectedFighterObj;
var _selectedDefenderObj;

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

$('#restart-button').on('click', function() {
	window.location.reload();
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

	// As default, use the all character objects array
	if(charactersArray === null) {
		loopOnThisArray = _allCharacterObjects;
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
	if(typeof _selectedFighterObj === 'undefined') {
		$('#selected-character').empty();

		/* Remove orange shadow */
		$(characterElement).removeClass('element-orange-box-shadow');

		/* Add green shadow to identify as current */
		$(characterElement).addClass('element-green-box-shadow');

		$('#selected-character').append(characterElement);

		characterObject.selectedAsFighter = true;

		_selectedFighterObj = characterObject;

		// Play selected sound
		$(characterObject.selectedAudioId)[0].play();

		populateAvailableEnemies();

		// Enable attack button
		$('#attack-button').prop('disabled', false);
	}
	// The hasBeenDefeated flag is checked to handle cases when a user is selecting a new enemy
	// after having defeated one
	else if(typeof _selectedDefenderObj === 'undefined' || _selectedDefenderObj.hasBeenDefeated) {
		$('#enemy-selected').empty();

		$('#vs-text').fadeIn('slow');

		/* Remove red shadow because this character is now a defender */
		$(characterElement).removeClass('element-red-box-shadow');

		/* Add green shadow to identify as current */
		$(characterElement).addClass('element-green-box-shadow');

		characterObject.selectedAsDefender = true;

		$('#enemy-selected').append(characterElement);

		_selectedDefenderObj = characterObject;

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

	for(var i=0; i<_allCharacterObjects.length; i++) {
		var currentObject = _allCharacterObjects[i];
		
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

			// Finally, we add this character object to the available enemies array.
			// This will help later processing.
			_availableEnemyObjects.push(currentObject);
		}
	}

	return;
}

// Shifts available enemy panels to ensure no empty slots are displayed
function shiftAvailableEnemies() {
	var elementIdCounter = 1;

	for(var i=0; i<_allCharacterObjects.length; i++) {
		var currentObject = _allCharacterObjects[i];

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
	if(typeof _selectedDefenderObj === 'undefined' || _selectedDefenderObj.hasBeenDefeated) {
		attackMessages.empty();
		attackMessages.append("You have not selected a defender!");
	} else {
		// Play attack sound
		$('#light-saber-clash')[0].play();

		attackMessages.empty();

		// Subtract from selected fighter health points
		if(_selectedDefenderObj.healthPoints > _selectedFighterObj.attackPower) {
			_selectedFighterObj.healthPoints -= _selectedDefenderObj.counterAttackPower;
		}

		// Subtract from enemy health points
		_selectedDefenderObj.healthPoints -= _selectedFighterObj.attackPower;

		attackMessages.append('You attacked ' + _selectedDefenderObj.name + ' for ' + _selectedFighterObj.attackPower + ' damage.<br>');
		
		attackMessages.append(_selectedDefenderObj.name + ' attacked you for ' + _selectedDefenderObj.counterAttackPower + ' damage.');
	
		// Increase selected fighter attack power
		_selectedFighterObj.increaseAttackPower();

		displayCharacterStats([_selectedFighterObj, _selectedDefenderObj]);

		// Check if user has won this fight
		if(hasUserWonMatch()) {
			attackMessages.empty();
			attackMessages.append('You have defeated ' + _selectedDefenderObj.name + '.<br>Choose another enemy to fight!');

			clearDefender();

			if(hasUserWonGame()) {
				endTheGame(true, false);
			}
		} 
		else if(hasUserLost()) {
			endTheGame(false, false);
		}
		else if(isMatchDraw()) {
			endTheGame(false, true);
		}
	}

	return;
}

// Checks if the user has won the current match
function hasUserWonMatch() {
	if(_selectedFighterObj.healthPoints > 0 && _selectedDefenderObj.healthPoints <= 0) {
		return true;
	}

	return false;
}

// Checks if the user has defeated all enemies and won the game
function hasUserWonGame() {
	if(_selectedFighterObj.healthPoints > 0) {
		for(var i=0; i<_availableEnemyObjects.length; i++) {
			var curObj = _availableEnemyObjects[i];

			// If any available enemies with hasBeenDefeated set to true exist
			// the user has not won the game yet, so don't continue checking
			if(!curObj.hasBeenDefeated) {
				return false;
			} else {
				continue;
			}
		}

		// Execution should only reach here if all available enemies 
		// have been defeated.
		return true;
	}

	return false;
}

// Checks if the user has lost
function hasUserLost() {
	if(_selectedFighterObj.healthPoints <= 0 && _selectedDefenderObj.healthPoints > 0) {
		return true;
	}

	return false;
}

// For those times when a draw is all you have left 
function isMatchDraw() {
	if(_selectedFighterObj.healthPoints <= 0 && _selectedDefenderObj.healthPoints <= 0) {
		return true;
	}

	return false;
}

// Clears the defender panel
function clearDefender() {
	_selectedDefenderObj.hasBeenDefeated = true;

	$('#enemy-selected').empty();

	$('#vs-text').fadeOut('slow');

	return;
}

// Ends game based on if user has won or lost and will 
// add the restart button to the DOM
function endTheGame(isWinner, isDraw) {
	var attackMessages = $('#attack-messages');

	var audioElementId;
	var message;

	if(isWinner) {
		audioElementId = '#the-force-is-strong';

		message = 'You have defeated all your enemies.  Well done!';
	} else if(isDraw) {
		audioElementId = '#doomed';

		message = 'It\'s a draw!  What are the odds of that?  GAME OVER!';
	}
	else {
		audioElementId = '#the-power-of-the-darkside';

		message = _selectedDefenderObj.name + ' has defeated you.  GAME OVER!';
	}

	// Here as precaution only
	// The pause method results in an exception to the console, will need to improve this
	$('#light-saber-clash')[0].pause();

	$(audioElementId)[0].play();

	attackMessages.empty();

	attackMessages.append(message);

	// Disable attack button
	$('#attack-button').prop('disabled', true);

	$('#restart-button').show();

	return;
}