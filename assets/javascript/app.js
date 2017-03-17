// working on interval

$(document).ready(function() {

	var rightAnswer;
	var askCount = 5;
	var right = 0;
	var wrong = 0;
	var unanswered = 0;
	var timer = 20;
	var interval;
	

	var askedArr = [];
	var questArr = [
	questOne = {
		question: "This is question one.",
		answers: [
		answerOne = {
			answer: "One One",
			correct: true
		},
		answerTwo = {
			answer: "Two",
			correct: false
		},
		answerThree = {
			answer: "Three",
			correct: false
		},
		answerFour = {
			answer: "Four",
			correct: false
		}
		],
		asked: []
	},
	questTwo = {
		question: "This is question two.",
		answers: [
		answerOne = {
			answer: "Two One",
			correct: true
		},
		answerTwo = {
			answer: "Two",
			correct: false
		},
		answerThree = {
			answer: "Three",
			correct: false
		},
		answerFour = {
			answer: "Four",
			correct: false
		}
		],
		asked: []
	},
	questThree = {
		question: "This is question three.",
		answers: [
		answerOne = {
			answer: "Three One",
			correct: true
		},
		answerTwo = {
			answer: "Two",
			correct: false
		},
		answerThree = {
			answer: "Three",
			correct: false
		},
		answerFour = {
			answer: "Four",
			correct: false
		}
		],
		asked: []
	},
	questFour = {
		question: "This is question four.",
		answers: [
		answerOne = {
			answer: "Four One",
			correct: true
		},
		answerTwo = {
			answer: "Two",
			correct: false
		},
		answerThree = {
			answer: "Three",
			correct: false
		},
		answerFour = {
			answer: "Four",
			correct: false
		}
		],
		asked: []
	},
	questFive = {
		question: "This is question Five.",
		answers: [
		answerOne = {
			answer: "Five One",
			correct: true
		},
		answerTwo = {
			answer: "Two",
			correct: false
		},
		answerThree = {
			answer: "Three",
			correct: false
		},
		answerFour = {
			answer: "Four",
			correct: false
		}
		],
		asked: []
	}
	];

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function chooseQuestion() {
		var num = randomNumber(0, questArr.length - 1);
		var question = questArr[num];
		askCount--;
		timer = 20;

		askedArr.push(question);

		$("#game").show();

		writeQuestion(questArr[num]);
		writeAnswers(questArr[num]);
		startTimer();

		questArr.splice(num, 1);
	}

	function writeQuestion(obj) {
		$("#timer").html("Time remaining: " + timer + " seconds.");
		$("#question").html(obj.question);

	}

	function writeAnswers(obj) {
		var count = 1;
		var length = obj.answers.length;

		for (var i = 0; i < length; i++) {
			var num = randomNumber(0, obj.answers.length - 1);
			var answer = obj.answers[num];

			$("#answer-" + count).html(answer.answer).attr("correct", answer.correct);

			if (answer.correct === true) {
				rightAnswer = answer.answer;
			}

			obj.asked.push(answer);
			obj.answers.splice(num, 1);

			count++;
		}
		
	}

	function correctAnswer() {
		$("#game").hide();
		$("#congrats").show();

		setTimeout(nextQuestion, 2000);
	}

	function wrongAnswer() {
		$("#game").hide();
		$("#school").show();

		$("#school-message").html("The correct answer was: " + rightAnswer);

		setTimeout(nextQuestion, 2000);
	}

	function nextQuestion() {
		$("#congrats, #school").hide();

		if (askCount > 0) {
			chooseQuestion();
		} else {
			endGame();
		}
	}

	function endGame() {
		$("#game").hide();
		$("#results").show();

		writeResults();
	}

	function writeResults() {
		$("#scoreboard").html(
			'<p>Correct Answers: ' + right + ';</p>' +
			'<p>Wrong Answers: ' + wrong + ';</p>'
			);
	}

	function repopQuestArr() {
		for (var i = 0; i < askedArr.length; i++) {
			questArr.push(askedArr[i]);
		}
		askedArr = [];
	}

	function startTimer() {
		interval = setInterval(countdown, 1000);
	}

	function stopTimer() {
		clearInterval(interval);
	}

	function countdown() {
		timer--;

		$("#timer").html("Time remaining: " + timer + " seconds.");

		if (timer === 5) {
			$("#clock-tick")[0].play();
		}

		if (timer === 0) {
			$("#timer").html("Your time is up!");
			stopTimer();
			setTimeout(wrongAnswer, 1000);
		}
	}

	$("#play").on("click", function() {
		$("#start-screen").hide();

		chooseQuestion();
	});

	$(".answer").on("click", function() {
		if ($(this).attr("correct") === "true") {
			right++;
			stopTimer();
			correctAnswer();
		} else {
			wrong++;
			stopTimer();
			wrongAnswer();
		}
	});

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