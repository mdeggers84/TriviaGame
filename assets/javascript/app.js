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
	var questArr = [];

	// decided to use opentdb api. spliced it into my original code template, so the code is a little inefficient
	function getQuestions() {
		var queryURL = "https://opentdb.com/api.php?amount=15&category=32&difficulty=easy&type=multiple";
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			console.log(response);
			var results = response.results;
			for (var i = 0; i < results.length; i++) {
				var question = "quest-" + i;
				questArr.push(
					question = {
						text: results[i].question,
						answers: [
						answerOne = {
							text: results[i].correct_answer,
							correct: true
						},
						answerTwo = {
							text: results[i].incorrect_answers[0],
							correct: false
						},
						answerThree = {
							text: results[i].incorrect_answers[1],
							correct: false
						},
						answerFour = {
							text: results[i].incorrect_answers[2],
							correct: false
						}
						],
						asked: []
						});
			}
			chooseQuestion();
		});
	}

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

			$answerID.html(i+1 + ". " + answer.text).attr("correct", answer.correct).removeClass("right wrong");

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
		}, 2500);
	}

	// utilizes giphy api to pull an array of top search results for the passed keyword and displays one
	// i set this up before seeing the cat-button activity--althought it is way more efficient, i'm stubbornly using this method until a later update
	function getGiphy(keyword, correct) {
		var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=dc6zaTOxFJmzC";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			var num = getRandom(0, response.data.length - 1);
			var gif = response.data[num].images.fixed_height.url;
			var imgSrc = '<img src="' + gif + '" alt="gif" class="gif">';

			if (correct) {
				$("#congrats-gif").html(imgSrc);
				$("#congrats-message").html("Chose the correct answer, you did!");
				$("#game").hide();
				$("#congrats").show();
			} else {
				$("#school-gif").html(imgSrc);
				$("#school-message").html("The correct answer is : <br>"  + rightAnswer);
				$("#game").hide();
				$("#school").show();
			}
			setTimeout(nextQuestion, 3500);
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
		var gif;

		if (unanswered > right && unanswered > wrong) {
			gif = $("<img>").attr("src", "assets/images/grumpy.gif").attr("alt", "gif");
		} else if (right > wrong) {
			gif = $("<img>").attr("src", "assets/images/sloth.gif").attr("alt", "gif");		
		} else if (wrong > right) {
			gif = $("<img>").attr("src", "assets/images/panda.gif").attr("alt", "gif");		
		}

		$("#scoreboard").html(
			'<p>Correct Answers: ' + right + ';</p>' +
			'<p>Wrong Answers: ' + wrong + ';</p>' +
			'<p>Unanswered: ' + unanswered + ';</p>'
			)
		.prepend(gif);		
	}

	// reinserts asked questions into the question pool
	function repopQuestArr() {
		for (var i = 0; i < askedArr.length; i++) {
			// adds asked questions back into answerArr and clears the temp arr
			askedArr[i].answers = askedArr[i].asked;
			askedArr[i].asked = [];
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
		getQuestions();
		
	});

	// on click events
	// answer selection
	$(".answer").on("click", function() {
		if (answered === false) {
			answered = true;
			if ($(this).attr("correct") == "true") {
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
		answered = false;

		repopQuestArr();

		$("#results").hide();

		chooseQuestion();
	});

});