function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
    var toShuffle = array.length;
    var temp, unShuffled;
    while (toShuffle) {
        unShuffled = Math.floor(Math.random() * toShuffle--);

        temp = array[toShuffle];
        array[toShuffle] = array[unShuffled];
        array[unShuffled] = temp;
    }
    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function () {
    return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.playersGuessSubmission = function (num) {
    if (num < 1 || num > 100 || typeof num !== "number") {
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
    }

    return this.checkGuess();
}

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        $("#go, #hint").prop('disabled', true);
        return "You Win!";
    } else if (this.pastGuesses.includes(this.playersGuess)) {
        return "You have already guessed that number.";
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guesses li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

        if (this.pastGuesses.length === 5) {
            $("#go, #hint").prop('disabled', true);
            return "You Lose.";
        } else if (this.difference() < 10) {
            return "You\'re burning up!";
        } else if (this.difference() < 25) {
            return "You\'re lukewarm.";
        } else if (this.difference() < 50) {
            return "You\'re a bit chilly.";
        } else {
            return "You\'re ice cold!";
        }
    }

}

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function () {
    return shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
}

$(document).ready(function () {
    var game = newGame();
    $('#go').click(function () {
        var guess = Number($("#player-enter").val());
        var result = game.playersGuessSubmission(guess);
        $("#player-enter").val('');
        $("#alerts").text(result);
    });
    $('#hint').click(function () {
        $("#alerts").text(game.provideHint());
    });
    $('#reset').click(function () {
        game = newGame();
        $("#alerts").text('a game in which you guess');
        $("#go, #hint").prop('disabled', false);
        $('.guess').text('-');
    });
});