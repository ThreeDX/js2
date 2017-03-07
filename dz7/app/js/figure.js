;(function () {
    'use strict';

    // Шахматная фигура (пешка)
    function Figure(position, isWhite) {
        this._isWhite = isWhite;
        this._position = position;
        this._fig = ['\u2659', '\u265F'];

    }

    // Список ячеек, куда может переместиться
    Figure.prototype.getMoves = function (board) {

    };

    // Список ячеек, которые под атакой
    Figure.prototype.getAttack = function (board) {

    };

    // Проверяет может ли переместиться в данную ячейку
    Figure.prototype.canMove = function (board, to) {

    };

    // Проверяет, находится ли ячейка под атакой данной фигуры
    Figure.prototype.CanAttack = function (board, to) {

    };

    // Размещает или меняет положение на доске
    Figure.prototype._setPosition = function (position) {

    };

    // Отрисовывает фигуру
    Figure.prototype.render = function (element) {
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


    //////////////////////////////

    // Шахматная фигура (ладья)
    function FigureCastle(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2656', '\u265C'];
    }

    FigureCastle.prototype = Object.create(Figure.prototype);
    FigureCastle.prototype.constructor = FigureCastle;


    //////////////////////////////

    // Шахматная фигура (конь)
    function FigureKnight(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2658', '\u265E'];
    }

    FigureKnight.prototype = Object.create(Figure.prototype);
    FigureKnight.prototype.constructor = FigureKnight;


    //////////////////////////////

    // Шахматная фигура (слон)
    function FigureBishop(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2657', '\u265D'];
    }

    FigureBishop.prototype = Object.create(Figure.prototype);
    FigureBishop.prototype.constructor = FigureBishop;


    //////////////////////////////

    // Шахматная фигура (ферзь)
    function FigureQueen(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2655', '\u265B'];
    }

    FigureQueen.prototype = Object.create(Figure.prototype);
    FigureQueen.prototype.constructor = FigureQueen;


    //////////////////////////////

    // Шахматная фигура (король)
    function FigureKing(position, isWhite) {
        Figure.apply(this, arguments);

        this._fig = ['\u2654', '\u265A'];
    }

    FigureKing.prototype = Object.create(Figure.prototype);
    FigureKing.prototype.constructor = FigureKing;


    //////////////////////////////

    window.Figure = Figure;
    window.FigureCastle = FigureCastle;
    window.FigureKnight = FigureKnight;
    window.FigureBishop = FigureBishop;
    window.FigureQueen = FigureQueen;
    window.FigureKing = FigureKing;

})();