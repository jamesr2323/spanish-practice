
    var controlBoxHtml = `
    <style>
      .control-box-container {
        font-size: 2em;
        text-align: center;
        margin: 20px;
        padding: 10px;
        border: 2px black solid;
      }
      .control-box-container input#answer-input {
        width: 400px;
      }
      .control-box-container input#time-offset-input {
        width: 30px;
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
      <input type="number" id="time-offset-input" placeholder="secs" value="1" />
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
      var startTime = $(this).data('config').init; //Adjust for delay
      questions.push({text: text, startTime: startTime});
    });

    // Hide distractions
    $('body > :not(#wrapper)').hide();
    $('#wrapper > :not(.video)').hide();
    $('.textRel').hide()
    $('.socialBox').hide()

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

    function getOffset(){
      return Number($('#time-offset-input').val());
    }

    function startQuestion(id){
      currentQuestion = id;
      $question = $transcriptBox.find('p:eq('+id+')');
      console.log(questions[id].text);

      videoElement.currentTime = questions[id].startTime + getOffset() - 0.5;
      videoElement.play();

      stopAt(questions[id+1].startTime + getOffset() + 0.5);

      $controlBox.hide();
      $('.answer-response-correct').hide();
      $('.answer-response-incorrect').hide();
    }

    function stopAt(time){
      if (videoElement.currentTime >= time){
        videoElement.pause();
        $controlBox.show();
      } else {
        setTimeout(function(){
          stopAt(time)
        }, 100);
      }
    }

