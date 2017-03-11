;(function () {
    'use strict';

    // Шахматная фигура (пешка)
    function Figure(position, isWhite) {
        this._isWhite = isWhite;
        this._position = position;
        this._fig = ['\u2659', '\u265F'];

        // Отрисовывает фигуру
        this.render = function (element) {
            element.innerHTML = (this._isWhite)
                ? this._fig[0]
                : this._fig[1];
            element.classList.toggle('ch-shadow', false);

            if (this._isWhite) {
                element.style.color = '#DDD';
                if (!element.classList.contains('ch-black')) {
                    element.classList.toggle('ch-shadow', true);
                }
            } else {
                element.style.color = '#222';
                if (element.classList.contains('ch-black')) {
                    element.classList.toggle('ch-shadow', true);
                }
            }
        };
    }

    //////////////////////////////

    // Шахматная фигура (ладья)
    function FigureCastle(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2656', '\u265C'];
    }

    //////////////////////////////

    // Шахматная фигура (конь)
    function FigureKnight(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2658', '\u265E'];
    }

    //////////////////////////////

    // Шахматная фигура (слон)
    function FigureBishop(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2657', '\u265D'];
    }

    //////////////////////////////

    // Шахматная фигура (ферзь)
    function FigureQueen(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2655', '\u265B'];
    }

    //////////////////////////////

    // Шахматная фигура (король)
    function FigureKing(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2654', '\u265A'];
    }

    //////////////////////////////

    window.Figure = Figure;
    window.FigureCastle = FigureCastle;
    window.FigureKnight = FigureKnight;
    window.FigureBishop = FigureBishop;
    window.FigureQueen = FigureQueen;
    window.FigureKing = FigureKing;

})();