;(function () {
    'use strict';

    // Шахматная доска
    function ChessBoard(element) {
        Board.call(this, element, 8, 8, true);

        this._loaded = false;
        this._figures = {};

        this.addEventListener("activeCell", function (e) {
            if (e.detail.oldCell) {
                console.log('Cell ' + e.detail.oldCell.id + ' deactivated');
                this.removeFigure(e.detail.oldCell.id); // Для примера удаления фигуры при клике
            }

            if (e.detail.newCell) {
                console.log('Cell ' + e.detail.newCell.id + ' activated');
                this.removeFigure(e.detail.newCell.id); // Для примера удаления фигуры при клике
            }
        }.bind(this));

        this.addEventListener("renderCell", function (e) {
            if (!this._loaded) {
                return;
            }

            // Рендерим фигуру
            if (this._figures.hasOwnProperty(e.detail.Cell.id)) {
                this._figures[e.detail.Cell.id].render(e.detail.Cell);
            }
        }.bind(this));
    }

    ChessBoard.prototype = Object.create(Board.prototype);
    ChessBoard.prototype.constructor = ChessBoard;

    // Устанавливает активную ячейку по номеру или возвращает текущую активную ячейку
    ChessBoard.prototype.activeCell = function (cell) {
        if (!this._rendered)
            return null;

        // Нужно вернуть номер текущей активной ячейки
        if (!cell && this._lastActive) {
            return this._lastActive.id;
        }

        // Устанавливаем новую активную ячейку
        if (typeof cell == "string" && /^[A-H]{1}[1-8]{1}$/.test(cell)) {
            var element = document.getElementById(cell);

            if (!element)
                return false;

            var oldElement = this._lastActive;

            if (this._lastActive)
                this._lastActive.classList.remove('ch-active');

            if (this._lastActive != element) {
                element.classList.add('ch-active');
                this._lastActive = element;
            } else
                this._lastActive = null;

            this.triggerEvent("activeCell", {
                oldCell: oldElement,
                newCell: this._lastActive
            });

            return true;
        }

        return null;
    };

    // Заполняет доску фигурами из json
    ChessBoard.prototype.init = function(link) {
        this._clearFigures();

        var xhr = new XMLHttpRequest();
        xhr.open('GET', link, true);
        xhr.send();

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                try {
                    this._setFigures( JSON.parse(xhr.responseText) );

                } catch (e) {
                    console.log('Ошибка инициализации фигурами: ' + e);
                }
            }
        }.bind(this);

    };

    // Заполняет объект данных с фигурами
    ChessBoard.prototype._setFigures = function (figures) {
        for (var i = 0; i < figures.length; i++) {
            if (!( /^[A-H]{1}[1-8]{1}$/.test(figures[i].cell) )) {
                throw "Неверная ячейка: " + figures[i].cell;
            }

            if (this._figures.hasOwnProperty(figures[i].cell)) {
                throw "Несколько фигур в ячейке " + figures[i].cell;
            }

            switch(figures[i].figure) {
                case 'Figure':
                case 'FigureCastle':
                case 'FigureKnight':
                case 'FigureBishop':
                case 'FigureQueen':
                case 'FigureKing':
                    var figure = window[figures[i].figure];
                    this._figures[figures[i].cell] = new figure(figures[i].cell, figures[i].color == 'white');
                    break;
                default:
                    throw "Неизвестный тип фигуры: " + figures[i].figure;
            }
        }

        this._loaded = true;

        if (this._rendered) {
            this.render();
        }
    };

    // Очищает доску от фигур
    ChessBoard.prototype._clearFigures = function () {
        if (!this._loaded) {
            return;
        }

        this._loaded = false;
        this._figures = {};

        if (this._rendered) {
            this.render();
        }
    };

    // Убирает фигуру с доски
    ChessBoard.prototype.removeFigure = function (cell) {
        if (!this._loaded)
            return false;

        if (!this._figures.hasOwnProperty(cell))
            return false;

        this._figures[cell] = undefined;

        if(this._rendered) {
            var item = document.getElementById(cell);
            item.innerHTML = "";
        }
    };

    // Отключаем изменение размеров и отключение легенды для шахматной доски
    ChessBoard.prototype.setDimensions = function() {};
    ChessBoard.prototype.showLegend = function() {};

    window.ChessBoard = ChessBoard;
})();