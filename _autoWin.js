function autoWin() {
    $autoWin.style.display = 'none';
    $autoWin.removeEventListener('click', autoWin);
    unbindClick(
       '#stock .card:first-child,' +
       '#waste .card:first-child,' +
       '#fnd .card:first-child,' +
       '#fnd #spades.pile[data-empty="true"],' +
       '#fnd #hearts.pile[data-empty="true"],' +
       '#fnd #diamonds.pile[data-empty="true"],' +
       '#fnd #clubs.pile[data-empty="true"],' +
       '#tab .card[data-played="true"],' +
       '#tab .pile[data-empty="true"]'
    );
    unbindClick(
       '#waste .card:first-child' +
       '#tab .card:last-child',
       'double'
    );
    reset(table);
    render(table);
    autoWinAnimation(table);
    timer('stop');
    updateScore(getBonus());

    
 }
function autoWinAnimation(table) {
    var i = parseInt($tab.dataset.played);
    function animation_loop() {
          var bottomCards = []; 
          var els = d.querySelectorAll('#tab .card:last-child');
          for (var e in els) { 
             e = els[e];
             if (e.nodeType)
                bottomCards.push( parseRankAsInt(e.dataset.rank) );
          }
          var lowestRank = Math.min.apply(Math, bottomCards);
          var rank = parseIntAsRank(lowestRank);
          var e = d.querySelector('#tab .card[data-rank="'+rank+'"]');

          var suit = e.dataset.suit;
          var card = [rank, suit];
          var dest = suit+'s';

          if ( validateMove(card, dest) ) {
             var pile = e.parentElement.parentElement;
             $table.dataset.source = pile.dataset.pile;
             $table.dataset.dest = dest;
             makeMove();
             reset(table);
             render(table, playedCards);
          } else {
             reset(table);
             render(table, playedCards);
          }
       setTimeout(function() {
          i--;
          if (i !== 0) animation_loop();
          else throwConfetti();
       }, 100);
    };
    animation_loop();
 }