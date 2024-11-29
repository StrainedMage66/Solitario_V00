   function timer(action) {
    var minutes = 0;
    var seconds = 0;
    var gameplay = d.body.dataset.gameplay;
    $timer.dataset.action = action;
    switch (action) {
       case 'start' :
          Reloj = setInterval(function() {
             time++;
             minutes = parseInt(time / 60, 10);
             seconds = parseInt(time % 60, 10);
             minutes = minutes < 10 ? "0" + minutes : minutes;
             seconds = seconds < 10 ? "0" + seconds : seconds;
             $timerSpan.textContent = minutes + ':' + seconds;
             if ( time % 10 === 0 ) updateScore(-2);
          }, 1000);
          d.body.dataset.gameplay = 'active';
          if ( gameplay === 'paused')
          $playPause.removeEventListener('click', playTimer);
          $playPause.addEventListener('click', pauseTimer = function(){
             timer('pause');
          });
       break;
       case 'pause' :
          clearInterval(Reloj);
          d.body.dataset.gameplay = 'paused';
          if ( gameplay === 'active')
          $playPause.removeEventListener('click', pauseTimer);
          $playPause.addEventListener('click', playTimer = function(){
             timer('start');
          });
       break;
       case 'stop' :
          clearInterval(Reloj);
          d.body.dataset.gameplay = 'over';
       break;
       default : break;
    }
    return;
 }