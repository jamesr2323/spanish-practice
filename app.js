
    var controlBoxHtml = `
    <style>
      .control-box-container {
        font-size: 2em;
        text-align: center;
      }
      .control-box-container input {
        width: 400px;
      }
      .answer-response {
        display: none;
      }
      .answer-text {
        text-decoration: italic;
      }
    </style>
    <div class="control-box-container">
      <input type="text" id="answer-input" placeholder="type your translation here" />
      <button id="check-answer-button">Check!</button>
      <button class="try-again-button">Try again</button>
      <div class="answer-response answer-response-correct">Correct!</div>
      <div class="answer-response answer-response-incorrect">Incorrect! <span class="answer-text"></span> <button id="show-answer-button">Show Answer</button> <button class="try-again-button">Try again</button></div>
      <button id="next-button">Next!</button>
    </div>`;

    var $transcriptBox = $('.blindBox.trasBox') ;
    var $controlBox = $('.wrapper.video div.container:eq(1)').html(controlBoxHtml);
    var $stopButton = $('.vjs-play-control');
    var videoElement = $('video')[0];

    var currentQuestion = 0;
    var questions = [];

    $.each($transcriptBox.find('p'),function(){
      var text = $(this).text().trim();
      var startTime = $(this).data('config').init + 1; //Adjust for delay
      questions.push({text: text, startTime: startTime});
    });

    // Button click handlers
    $('#check-answer-button').click(function(){
      checkAnswer();
    });

    $('#next-button').click(function(){
      if (currentQuestion < (questions.length-1)){
        startQuestion(currentQuestion+1);
      }
    });

    $('.try-again-button').click(function(){
      startQuestion(currentQuestion);
    });

    $('#show-answer-button').click(function(){
      $('.answer-text').text(questions[currentQuestion].text)
    });

    function checkAnswer(){
      if ($('#answer-input').val() == questions[currentQuestion].text){
        $('.answer-response-correct').show();  
      } else {
        $('.answer-response-incorrect').show();
      }    
    }

    function startQuestion(id){
      currentQuestion = id;
      $question = $transcriptBox.find('p:eq('+id+')');
      console.log(questions[id].text);

      videoElement.currentTime = questions[id].startTime - 0.5;
      videoElement.play();

      stopAt(questions[id+1].startTime+0.5);

      $('.answer-response-correct').hide();
      $('.answer-response-incorrect').hide();
    }

    function stopAt(time){
      if (videoElement.currentTime >= time){
        videoElement.pause();
      } else {
        setTimeout(function(){
          stopAt(time)
        }, 100);
      }
    }
