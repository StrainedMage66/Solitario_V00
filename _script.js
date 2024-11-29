   var d = document;

   var deck = [];

   var suits = [];
   suits['spades'] = [
      ['A','spade'],
      ['2','spade'],
      ['3','spade'],
      ['4','spade'],
      ['5','spade'],
      ['6','spade'],
      ['7','spade'],
      ['8','spade'],
      ['9','spade'],
      ['10','spade'],
      ['J','spade'],
      ['Q','spade'],
      ['K','spade']
   ];
   
   suits['hearts'] = [
      ['A','heart'],
      ['2','heart'],
      ['3','heart'],
      ['4','heart'],
      ['5','heart'],
      ['6','heart'],
      ['7','heart'],
      ['8','heart'],
      ['9','heart'],
      ['10','heart'],
      ['J','heart'],
      ['Q','heart'],
      ['K','heart']
   ];
   suits['diamonds'] = [
      ['A','diamond'],
      ['2','diamond'],
      ['3','diamond'],
      ['4','diamond'],
      ['5','diamond'],
      ['6','diamond'],
      ['7','diamond'],
      ['8','diamond'],
      ['9','diamond'],
      ['10','diamond'],
      ['J','diamond'],
      ['Q','diamond'],
      ['K','diamond']
   ];
   suits['clubs'] = [
      ['A','club'],
      ['2','club'],
      ['3','club'],
      ['4','club'],
      ['5','club'],
      ['6','club'],
      ['7','club'],
      ['8','club'],
      ['9','club'],
      ['10','club'],
      ['J','club'],
      ['Q','club'],
      ['K','club']
   ];

   var s = [];

   var w = [];

   var spades = [];
   var hearts = [];
   var diamonds = [];
   var clubs = [];

   var t = [];
   t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = [];

   var table = [];
   table['stock'] = s;
   table['waste'] = w;
   table['spades'] = spades;
   table['hearts'] = hearts;
   table['diamonds'] = diamonds;
   table['clubs'] = clubs;
   table['tab'] = t;

   var playedCards =
   '#waste .card,' +
   '#fnd .card,' +
   '#tab .card:last-child';

   var $timer = d.querySelector('#score .timer');
   var $timerSpan = d.querySelector('#score .timer span');
   var $moveCount = d.querySelector('#score .move-count');
   var $moveCountSpan = d.querySelector('#score .move-count span');
   var $score = d.querySelector('#score .score');
   var $scoreSpan = d.querySelector('#score .score span');
   var $playPause = d.querySelector('#play-pause');
   var $table = d.querySelector('#table');
   var $upper = d.querySelector('#table .upper-row');
   var $lower = d.querySelector('#table .lower-row');
   var $stock = d.querySelector('#stock');
   var $waste = d.querySelector('#waste');
   var $fnd = d.querySelector('#fnd');
   var $tab = d.querySelector('#tab');
   var $autoWin = d.querySelector('#auto-win');

   var Reloj = 0;
   var time = 0;
   var moves = 0;
   var score = 0;
   var bonus = 0;
   var lastEventTime = 0;
   var unplayedTabCards = [];

   deck = create(deck, suits);

   deck = shuffle(deck);

   table = deal(deck, table);

   render(table, playedCards);

   play(table);

   window.onresize = function(event) {
      sizeCards();
   };


      function create(deck, suits) {
         for (var suit in suits) {
            suit = suits[suit];
            for (var card in suit) {
               card = suit[card];
               deck.push(card); 
            }
         }
         return deck;
      }

      function shuffle(deck) {
         var i = deck.length, temp, rand;
         while (0 !== i) {
            rand = Math.floor(Math.random() * i);
            i--;
            temp = deck[i];
            deck[i] = deck[rand];
            deck[rand] = temp;
         }
         return deck;
      }

      function deal(deck, table) {
         table['stock'] = deck;
            var tabs = table['tab'];
            for (var row = 1; row <= 7; row++) {
               for (var pile = row; pile <= 7; pile++) {
                  if (row === 1) tabs[pile] = [];
                  move(table['stock'], tabs[pile], false);
               }
            }
         return table;
      }

      function move(source, dest, pop, selectedCards = 1) {
         if (pop !== true) {
            var card = source.shift(); 
            dest.push(card); 
         } else {
            while (selectedCards) {
               var card = source[source.length - selectedCards];
               source.splice(source.length - selectedCards, 1);
               dest.push(card);
               selectedCards--; 
            }
         }
         return;
      }

      function render(table, playedCards) {

         playedCards = checkForPlayedCards(playedCards);

         emptyPiles = checkForEmptyPiles(table);

         update(table['stock'], '#stock ul', playedCards, true);
         update(table['waste'], '#waste ul', playedCards);
         update(table['spades'], '#spades ul', playedCards);
         update(table['hearts'], '#hearts ul', playedCards);
         update(table['diamonds'], '#diamonds ul', playedCards);
         update(table['clubs'], '#clubs ul', playedCards);
         var tabs = table['tab'];
         for (var i = 1; i <= 7; i++) {
            update(tabs[i], '#tab li:nth-child('+i+') ul', playedCards, true);
         }

         unplayedTabCards = getUnplayedTabCards();

         sizeCards();

         $table.style.opacity = '100';

         return;
      }

      function update(pile, selector, playedCards, append) {
         var e = d.querySelector(selector);
         var children = e.children; 
         var grandParent = e.parentElement.parentElement; 
         e.innerHTML = '';
         for (var card in pile) {
            card = pile[card];
            var html = getTemplate(card);
            createCard(card, selector, html, append);
         }
         flipCards(playedCards, 'up');
         var played = countPlayedCards(children);
         e.parentElement.dataset.played = played;
         if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
            var playedAll = parseInt(grandParent.dataset.played);
            if ( isNaN(playedAll) ) playedAll = 0;
            grandParent.dataset.played = playedAll + played;
         }
         var unplayed = countUnplayedCards(children);
         e.parentElement.dataset.unplayed = unplayed;
         if ( grandParent.id === 'tab' || grandParent.id === 'fnd' ) {
            var unplayedAll = parseInt(grandParent.dataset.unplayed);
            if ( isNaN(unplayedAll) ) unplayedAll = 0;
            grandParent.dataset.unplayed = unplayedAll + unplayed;
         }
         return pile;
      }

      function getTemplate(card) {
         var r = card[0]; 
         var s = card[1]; 
         var html = d.querySelector('.template li[data-rank="'+r+'"]').innerHTML;
         html = html.replace('{{suit}}', s);
         return html;
      }

      function createCard(card, selector, html, append) {
         var r = card[0]; 
         var s = card[1]; 
         if ( selector.includes('#stock') ) var p = 'stock';
         if ( selector.includes('#waste') ) var p = 'waste';
         if ( selector.includes('#spades') ) var p = 'spades';
         if ( selector.includes('#hearts') ) var p = 'hearts';
         if ( selector.includes('#diamonds') ) var p = 'diamonds';
         if ( selector.includes('#clubs') ) var p = 'clubs';
         if ( selector.includes('#tab') ) var p = 'tab';
         var e = d.createElement('li'); 
         e.className = 'card'; 
         e.dataset.rank = r; 
         e.dataset.suit = s; 
         e.dataset.pile = p; 
         e.dataset.selected = 'false'; 
         e.innerHTML = html; 
         var pile = d.querySelector(selector);
         if (append) pile.appendChild(e);
         else pile.insertBefore(e, pile.firstChild);
         return;
      }

      function checkForPlayedCards(playedCards) {
         var els = d.querySelectorAll('.card[data-played="true"]');
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) {
               var r = e.dataset.rank;
               var s = e.dataset.suit;
               playedCards += ', .card[data-rank="'+r+'"][data-suit="'+s+'"]' ;
            }
         }
         return playedCards;
      }

      function checkForEmptyPiles(table) {
         var els = d.querySelectorAll('.pile'); 
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) {
               delete e.dataset.empty;
            }
         }
         var emptyPiles = '#fake.pile';
         if ( table['spades'].length === 0 ) {
            emptyPiles += ', #fnd #spades.pile';
         }
         if ( table['hearts'].length === 0 ) {
            emptyPiles += ', #fnd #hearts.pile';
         }
         if ( table['diamonds'].length === 0 ) {
            emptyPiles += ', #fnd #diamonds.pile';
         }
         if ( table['clubs'].length === 0 ) {
            emptyPiles += ', #fnd #clubs.pile';
         }
         var tabs = table['tab'];
            for (var i = 1; i <= 7; i++) {
               if ( tabs[i].length === 0 ) {
                  emptyPiles += ', #tab li:nth-child('+i+').pile';
               }
            }
         els = d.querySelectorAll(emptyPiles); 
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) {
               e.dataset.empty = 'true'; 
            }
         }
         return emptyPiles;
      }

      function countPlayedCards(cards) {
         var played = 0;
            for (var card in cards) {
               card = cards[card];
               if (card.nodeType) {
                  if (card.dataset.played === 'true') played++;
               }
            }
         return played;
      }

      function countUnplayedCards(cards) {
         var unplayed = 0;
            for (var card in cards) {
               card = cards[card];
               if (card.nodeType) {
                  if (card.dataset.played !== 'true') unplayed++;
               }
            }
         return unplayed;
      }

      function flipCards(selectors, direction) {
         var els = d.querySelectorAll(selectors); 
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) {
               switch(direction) {
                  case 'up' :
                     if (e.dataset.played !== 'true') {
                        if (e.dataset.pile === 'tab') {
                           for (var card in unplayedTabCards) {
                              card = unplayedTabCards[card];
                              if (  e.dataset.rank === card[0] &&
                                    e.dataset.suit === card[1] )
                              updateScore(5);
                           }
                        }
                        e.className += ' up'; 
                        e.dataset.played = 'true'; 
                     }
                     break;
                  case 'down' :
                     e.className = 'card'; 
                     delete e.dataset.played; 
                  default : break;
               }
            }
         }
         return;
      }

      function getUnplayedTabCards() {
         unplayedTabCards = [];
         var els = d.querySelectorAll('#tab .card:not([data-played="true"])');
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) {
               unplayedTabCards.push( [ e.dataset.rank, e.dataset.suit ] );
            }
         }
         return unplayedTabCards;
      }

      function sizeCards(selector = '.pile', ratio = 1.4) {
         var s = selector;
         var r = ratio;
         var e = d.querySelector(s); 
         var h = e.offsetWidth * r; 
         $upper.style.height = h + 10 + 'px';
         $lower.style.height = h + 120 + 'px';
         var els = d.querySelectorAll(s); 
         for (var e in els) { 
            e = els[e];
            if (e.nodeType) e.style.height = h + 'px'; 
         }
      }

      function play(table) {
         if ( checkForWin(table) ) return;
         checkForAutoWin(table);
         bindClick(
            '#stock .card:first-child,' +
            '#waste .card:first-child,' +
            '#fnd .card:first-child,' +
            '#tab .card[data-played="true"]'
         );
         bindClick(
            '#waste .card:first-child,' +
            '#tab .card:last-child',
            'double'
         );
      }

      function bindClick(selectors, double) {
         var elements = d.querySelectorAll(selectors); 
         for (var e in elements) {
            e = elements[e];
            if (e.nodeType) {
               if (!double) e.addEventListener('click', select);
               else e.addEventListener('dblclick', select);
            }
         }
         return;
      }

      function unbindClick(selectors, double) {
         var elements = d.querySelectorAll(selectors);
         for (var e in elements) {
            e = elements[e];
            if (e.nodeType) {
               if (!double) e.removeEventListener('click', select);
               else e.removeEventListener('dblclick', select);
            }
         }
         return;
      }

      var clicks = 0; 
      var clickDelay = 200; 
      var clickTimer = null; 
      function select(event) {

         event.preventDefault();

         if ( $timer.dataset.action !== 'start' ) {
            timer('start');
         }

         var time = event.timeStamp; 
         if ( time === lastEventTime ) {
            return false;
         }
         else {
            lastEventTime = time; 
         }

         var e = event.target; 
         var isSelected = e.dataset.selected; 
         var rank = e.dataset.rank; 
         var suit = e.dataset.suit; 
         var pile = e.dataset.pile; 
         var action = e.dataset.action; 

         if (rank && suit) var card = [rank,suit];

         clicks++;

         if (clicks === 1 && event.type === 'click') {
            clickTimer = setTimeout(function() {

               clicks = 0;

               if (e.dataset.selected === 'true') {
                  delete e.dataset.selected;
                  delete $table.dataset.move;
                  delete $table.dataset.selected;
                  delete $table.dataset.source;
               }

               else if ($table.dataset.move) {
                  var selected = $table.dataset.selected.split(',');
                  $table.dataset.dest = e.closest('.pile').dataset.pile;
                  if ( card ) var dest = card;
                  else var dest = $table.dataset.dest;
                  if ( validateMove(selected, dest) ) {
                     makeMove();
                     reset(table);
                     render(table, playedCards);
                     play(table);
                  } else {
                     reset(table);
                     render(table, playedCards);
                     play(table);
                  }
               }

               else if (pile === 'stock') {
                  if (table['stock'].length) {
                     move(table['stock'], table['waste']);
                     reset(table);
                     render(table, playedCards);
                     if (table['stock'].length === 0) bindClick('#stock .reload-icon');
                     countMove(moves++);
                     play(table);
                  }
               }

               else if (action === 'reload') {
                  unbindClick('#stock .reload-icon');
                  if (table['waste'].length) {
                     table['stock'] = table['waste']; 
                     table['waste'] = [] 
                  }
                  render(table, playedCards);
                  flipCards('#stock .card', 'down');
                  updateScore(-100);
                  play(table);
               }

               else {
                  e.dataset.selected = 'true';
                  $table.dataset.move = 'true';
                  $table.dataset.selected = card;
                  $table.dataset.source = e.closest('.pile').dataset.pile;
                  if (rank === 'A') {
                     bindClick('#fnd #'+suit+'s.pile[data-empty="true"]');
                  }
                  if (rank === 'K') {
                     bindClick('#tab .pile[data-empty="true"]');
                  }
               }

            }, clickDelay);
         }

         else if (event.type === 'dblclick') {
            clearTimeout(clickTimer); 
            clicks = 0; 
            e.dataset.selected = 'true';
            $table.dataset.move = 'true';
            $table.dataset.selected = card;
            $table.dataset.source = e.closest('.pile').dataset.pile;
            if ( card) var dest = card[1]+'s';
            $table.dataset.dest = dest;
            if ( validateMove(card, dest) ) {
               makeMove();
               reset(table);
               render(table, playedCards);
               play(table);
            } else {
               reset(table);
               render(table, playedCards);
               play(table);
            }

         }

      }

      function validateMove(selected, dest) {

         if (selected) {
            var sRank = parseRankAsInt(selected[0]);
            var sSuit = selected[1];
         }

         if (dest.constructor === Array) {
            var dRank = parseRankAsInt(dest[0]);
            var dSuit = dest[1];
            var dPile = $table.dataset.dest;
            if (['spades','hearts','diamonds','clubs'].indexOf(dPile) >= 0) {
               if (dRank - sRank !== -1) {
                 return false;
               }
               if ( sSuit !== dSuit ) {
                  return false;
               }
            }
            else {
               if (dRank - sRank !== 1) {
                 return false;
               }
               if ( ( (sSuit === 'spade' || sSuit === 'club') &&
                  (dSuit === 'spade' || dSuit === 'club') ) ||
                  ( (sSuit === 'heart' || sSuit === 'diamond') &&
                  (dSuit === 'heart' || dSuit === 'diamond') ) ) {
                 return false;
               }
            }
            return true;

         }

         if (['spades','hearts','diamonds','clubs'].indexOf(dest) >= 0) {

            var lastCard = d.querySelector('#'+dest+' .card:first-child');
            if (lastCard) {
               var dRank = parseRankAsInt(lastCard.dataset.rank);
               var dSuit = lastCard.dataset.suit;
            }
            if ( sSuit + 's' !== dest ) {
               return false;
            }
            else if ( sRank === 1 ) {
               return true;
            }
            else if ( sRank - dRank !== 1 ) {
               return false;
            }
            else {
               return true;
            }
         }

         if ( dest >= 1 && dest <= 7 ) {
            return true;
         }

      }

      function makeMove() {

         var source = $table.dataset.source;
         var dest = $table.dataset.dest;

         if ( source === 'waste') {
            if ( isNaN(dest) ) {
               move(table[source], table[dest], true);
               updateScore(10); 
            }
            else {
               move(table[source], table['tab'][dest], true);
               updateScore(5); 
            }
         }

         else if (['spades','hearts','diamonds','clubs'].indexOf(source) >= 0) {
            if ( isNaN(dest) ) {
               return false;
            }
            else {
               move(table[source], table['tab'][dest], true);
               updateScore(-15); 
            }
         }

         else {
            if ( isNaN(dest) ) {
               move(table['tab'][source], table[dest], true);
               updateScore(10); 
            }
            else {
               var selected = d.querySelector('.card[data-selected="true"');
               var selectedCards = [selected];
               while ( selected = selected['nextSibling'] ) {
                  if (selected.nodeType) selectedCards.push(selected);
               }
               move(
                  table['tab'][source],
                  table['tab'][dest],
                  true,
                  selectedCards.length
               );
            }
         }

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
         )

         countMove(moves++);


         return;
      }

      function parseRankAsInt(rank) {
         switch (rank) {
            case 'A' : rank = '1'; break;
            case 'J' : rank = '11'; break;
            case 'Q' : rank = '12'; break;
            case 'K' : rank = '13'; break;
            default : break;
         }
         return parseInt(rank);
      }

      function parseIntAsRank(int) {
         rank = parseInt(int);
         switch(rank) {
            case 1 : rank = 'A'; break;
            case 11 : rank = 'J'; break;
            case 12 : rank = 'Q'; break;
            case 13 : rank = 'K'; break;
            default : break;
         }
         return rank;
      }

      function reset(table) {
         delete $table.dataset.move;
         delete $table.dataset.selected;
         delete $table.dataset.source;
         delete $table.dataset.dest;
         delete $fnd.dataset.played;
         delete $fnd.dataset.unplayed;
         delete $tab.dataset.played;
         delete $tab.dataset.unplayed;
      }



      function countMove(moves) {
         $moveCount.dataset.moves = moves + 1;
         $moveCountSpan.textContent = moves + 1;
         return;
      }

      function checkForWin(table) {
         if (  table['spades'].length +
               table['hearts'].length +
               table['diamonds'].length +
               table['clubs'].length
               === 52 ) {
            timer('stop');
            updateScore(getBonus());
            throwConfetti();
            return true;
         }
         else return false;
      }

      function checkForAutoWin(table) {
         if (  parseInt($tab.dataset.unplayed) +
               table['stock'].length +
               table['waste'].length === 0) {
            $autoWin.style.display = 'block';
            $autoWin.addEventListener('click', autoWin);
         }
         return;
      }