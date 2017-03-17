// working on interval

$(document).ready(function() {

	var right = 0;
	var wrong = 0;
	var interval;

	var askedArr = [];
	var questArr = [
	questOne = {
		question: "This is question two.",
		answers: [
		answerOne = {
			answer: "One",
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
			answer: "One",
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
			answer: "One",
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
			answer: "One",
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
			answer: "One",
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

	function startTimer() {
		interval = setInterval();
	}

	function stopTimer() {

	}

	function chooseQuestion() {
		var num = randomNumber(0, questArr.length - 1);
		var question = questArr[num];
		askedArr.push(question);

		$("#game").show();

		writeQuestion(questArr[num]);
		writeAnswers(questArr[num]);

		questArr.splice(num, 1);
	}

	function writeQuestion(obj) {
		$("#question").html(obj.question);

	}

	function writeAnswers(obj) {
		var count = 1;
		var length = obj.answers.length;

		for (var i = 0; i < length; i++) {
			var num = randomNumber(0, obj.answers.length - 1);
			var answer = obj.answers[num];

			$("#answer-" + count).html(answer.answer).attr("correct", answer.correct);

			obj.asked.push(answer);
			obj.answers.splice(num, 1);

			count++;
		}
	}

	function correctAnswer() {
		$("#game").hide();
		$("#congrats").show();

		setTimeout(nextQuestion, 1000);
	}

	function wrongAnswer() {
		$("#game").hide();
		$("#school").show();

		$("#school-message").html("Wrong Answer");

		setTimeout(nextQuestion, 1000);
	}

	function nextQuestion() {
		$("#congrats, #school").hide();

		if (questArr.length > 0) {
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

	$("#play").on("click", function() {
		$("#start-screen").hide();

		chooseQuestion();
	});

	$(".answer").on("click", function() {
		if ($(this).attr("correct") === "true") {
			right++;
			correctAnswer();
		} else {
			wrong++;
			wrongAnswer();
		}
	});

	$("#replay").on("click", function() {
		right = 0;
		wrong = 0;
		questArr = askedArr;
		askedArr = [];

		$("#results").hide();

		chooseQuestion();
	});

});