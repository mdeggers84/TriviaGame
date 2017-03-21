$(document).ready(function() {

	var rightAnswer;
	var askCount = 5;
	var right = 0;
	var wrong = 0;
	var unanswered = 0;
	var timer = 20;
	var interval;
	var answered = false;
	

	var askedArr = [];
	var questArr = [
	questOne = {
		text: "This is question one.",
		answers: [
		answerOne = {
			text: "One One",
			correct: true
		},
		answerTwo = {
			text: "Two",
			correct: false
		},
		answerThree = {
			text: "Three",
			correct: false
		},
		answerFour = {
			text: "Four",
			correct: false
		}
		],
		asked: []
	},
	questTwo = {
		text: "This is question two.",
		answers: [
		answerOne = {
			text: "Two One",
			correct: true
		},
		answerTwo = {
			text: "Two",
			correct: false
		},
		answerThree = {
			text: "Three",
			correct: false
		},
		answerFour = {
			text: "Four",
			correct: false
		}
		],
		asked: []
	},
	questThree = {
		text: "This is question three.",
		answers: [
		answerOne = {
			text: "Three One",
			correct: true
		},
		answerTwo = {
			text: "Two",
			correct: false
		},
		answerThree = {
			text: "Three",
			correct: false
		},
		answerFour = {
			text: "Four",
			correct: false
		}
		],
		asked: []
	},
	questFour = {
		text: "This is question four.",
		answers: [
		answerOne = {
			text: "Four One",
			correct: true
		},
		answerTwo = {
			text: "Two",
			correct: false
		},
		answerThree = {
			text: "Three",
			correct: false
		},
		answerFour = {
			text: "Four",
			correct: false
		}
		],
		asked: []
	},
	questFive = {
		text: "This is question Five.",
		answers: [
		answerOne = {
			text: "Five One",
			correct: true
		},
		answerTwo = {
			text: "Two",
			correct: false
		},
		answerThree = {
			text: "Three",
			correct: false
		},
		answerFour = {
			text: "Four",
			correct: false
		}
		],
		asked: []
	}
	];

	// random numbers for gif, question, and answer selection
	function getRandom(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// chooses question and resets timer
	function chooseQuestion() {
		var num = getRandom(0, questArr.length - 1);
		var question = questArr[num];

		answered = false;
		askCount--;
		timer = 20;

		// stores asked question in array to be recycled on replay
		askedArr.push(question);

		$("#game").show();

		writeQuestion(questArr[num]);
		writeAnswers(questArr[num]);
		startTimer();

		// removes asked question from question pool
		questArr.splice(num, 1);
	}

	// writes the initial timer string and question to html
	function writeQuestion(obj) {
		$("#timer").html("Time remaining: " + timer + " seconds.");
		$("#question").html(obj.text);
	}

	// adds answers to html
	function writeAnswers(obj) {
		var count = 1;
		var length = obj.answers.length;

		// I randomize the write order to help prevent location memorization
		for (var i = 0; i < length; i++) {
			var num = getRandom(0, obj.answers.length - 1);
			var answer = obj.answers[num];
			var $answerID = $("#answer-" + count);

			$answerID.html(answer.text).attr("correct", answer.correct).removeClass("right wrong");

			if (answer.correct === true) {
				rightAnswer = answer.text;
			}

			obj.asked.push(answer);
			obj.answers.splice(num, 1);

			count++;
		}	
	}

	// called when question is answered correctly
	// moved a lot of this code inside ajax call when i implemented it
	function correctAnswer() {	
		getGiphy("yes", true);
	}

	// opposite of above. Added some extra style features.
	function wrongAnswer() {
		for (var i = 1; i <= 4; i++) {
			var $answer = $("#answer-" + i);

			if ($answer.attr("correct") === "true") {
				$answer.addClass("right");
			} else {
				$answer.addClass("wrong");
			}
		}

		// put getGiphy on a timeout to allow time for the highlighted answer effect
		setTimeout(function() {
			getGiphy("wrong", false);
		}, 2000);
	}

	// utilizes giphy api to pull an array of top search results for the passed keyword and displays one
	function getGiphy(keyword, correct) {
		var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			var num = getRandom(0, response.data.length - 1);
			var gif = response.data[num].images.downsized.url;
			var imgSrc = '<img src="' + gif + '" alt="gif">';

			if (correct) {
				$("#congrats").html("Chose the correct answer, you did!<br>" + imgSrc);
				$("#game").hide();
				$("#congrats").show();
			} else {
				$("#school-message").html("The correct answer was: " + rightAnswer + ".<br>" + imgSrc);
				$("#game").hide();
				$("#school").show();
			}
			setTimeout(nextQuestion, 3000);
		});
	}

	// monitors question count and either posts the next question or ends the game
	function nextQuestion() {
		$("#congrats, #school").hide();

		if (askCount > 0) {
			chooseQuestion();
		} else {
			endGame();
		}
	}

	// displays final results and allows replay
	function endGame() {
		$("#game").hide();
		$("#results").show();

		writeResults();
	}

	// posts results ot the screen
	function writeResults() {
		$("#scoreboard").html(
			'<p>Correct Answers: ' + right + ';</p>' +
			'<p>Wrong Answers: ' + wrong + ';</p>' +
			'<p>Unanswered: ' + unanswered + ';</p>'
			);
	}

	// reinserts asked questions into the question pool
	function repopQuestArr() {
		for (var i = 0; i < askedArr.length; i++) {
			questArr.push(askedArr[i]);
		}
		askedArr = [];
	}

	// timer functions
	function startTimer() {
		interval = setInterval(countdown, 1000);
	}

	// stops the timer for various scenarios (time up / answered question)
	function stopTimer() {
		clearInterval(interval);
	}

	// upates question timer
	function countdown() {
		timer--;

		$("#timer").html("Time remaining: " + timer + " seconds.");

		if (timer === 5) {
			$("#clock-tick")[0].play();
		}

		if (timer === 0) {
			answered = true;
			unanswered++;
			$("#timer").html("Your time is up!");
			stopTimer();
			setTimeout(wrongAnswer, 1000);
		}
	}

	// decided on a play button so the user isn't thrown into the game without being prepared.
	$("#play").on("click", function() {
		$("#start-screen").hide();

		chooseQuestion();
	});

	// on click events
	// answer selection
	$(".answer").on("click", function() {
		if (answered === false) {
			answered = true;
			if ($(this).attr("correct") === "true") {
				right++;
				stopTimer();
				correctAnswer();
			} else {
				wrong++;
				stopTimer();
				wrongAnswer();
			}
		}
	});

	// replays game after results are show, resets values
	$("#replay").on("click", function() {
		rightAnswer = "";
		right = 0;
		wrong = 0;
		unanswered = 0;
		askCount = 5;

		repopQuestArr();

		$("#results").hide();

		chooseQuestion();
	});

});