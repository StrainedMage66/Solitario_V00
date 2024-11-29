         function updateScore(points) {
            score = parseInt($score.dataset.score) + points;
            score = score < 0 ? 0 : score;
            score = parseInt(score);
            $score.dataset.score = score;
            $score.children[1].textContent = score;
            return score;
         }
   
         function getBonus() {
            if (time >= 30) bonus = parseInt(700000 / time);
            return bonus;
         }
   