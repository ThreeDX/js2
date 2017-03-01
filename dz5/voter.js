;(function() {
    'use strict';

    function Voter(options) {
        var elem = document.getElementById(options.elem);
        var voteElem = elem.getElementsByClassName('vote')[0];
        var votes = voteElem.textContent;

        elem.onmousedown = function() {
            return false;
        };

        elem.onclick = function(e) {
            if (e.target.classList.contains('down')) {
                setVote(votes - 1);
            }

            if (e.target.classList.contains('up')) {
                setVote(votes + 1);
            }
        };

        this.setVote = setVote;

        function setVote(vote) {
            if (vote < 0) {
                vote = 0;
            }

            votes = vote;
            voteElem.textContent = votes;
        }

    }

    window.Voter = Voter;
})();