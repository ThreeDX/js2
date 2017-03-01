;(function() {
    'use strict';

    function Clock(options) {
        var elem = document.getElementById(options.elem);
        var clock = document.createElement('div');
        var button = document.createElement('button');
        var isStarted = false;

        var alertTimer = null;
        var clockTimer = null;
        var alertCounter = 0;

        this.start = start;
        this.stop = stop;

        init();

        function init() {
            // Очищаем элемент
            elem.innerHTML = '';
            elem.onmousedown = function() {
                return false;
            };

            clock.classList.add('clock');
            clock.innerHTML = getTime();

            button.classList.add('button');
            button.innerHTML = 'ALERT';

            button.onclick = function() {
                button.disabled = true;
                alertCounter = 0;
                clock.classList.add('red');

                if (isStarted) {
                    _stop()
                }

                alertTimer = setInterval(function() {
                    alertCounter++;
                    if (alertCounter == 30) {
                        clearInterval(alertTimer);
                        alertTimer = null;
                        clock.classList.remove('red');
                        button.disabled = false;

                        if (isStarted) {
                            _start()
                        }
                    } else {
                        clock.classList.toggle('red');
                    }
                }, 250);
            };

            elem.appendChild(clock);
            elem.appendChild(button);
        }

        function _start() {
            if (clockTimer) {
                return;
            }

            clock.innerHTML = getTime();

            clockTimer = setInterval(function() {
                clock.innerHTML = getTime();
            }, 1000);
        }

        function _stop() {
            if (clockTimer) {
                clearInterval(clockTimer);
                clockTimer = null;
            }
        }

        function stop(pause) {
            _stop();
            isStarted = false;
        }

        function start() {
            _start();
            isStarted = true;
        }

        function getTime() {
            var d = new Date();
            return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
        }

        function pad(str) {
            return ('0' + str).substr(-2);
        }

    }

    window.Clock = Clock;
})();