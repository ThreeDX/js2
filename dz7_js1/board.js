;(function () {
    'use strict';

    function Board(element) {
        element = element || "board";

        // Элемент в который отрисовываем доску
        if (typeof element == "string") {
            var wrapper = document.getElementById(element);
            if (!wrapper) {
                throw new Error("Элемент " + element + " не найден!");
            }
        } else {
            wrapper = element;
        }

        var letters = "ABCDEFGH";
        var rendered = false;
        var figures = {}; // Хранилище фигур

        // Отрисовывает доску
        this.render = function () {
            rendered = true;

            // удаляем все потомки у враппера
            while (wrapper.firstChild) {
                wrapper.removeChild(wrapper.firstChild);
            }

            wrapper.classList.toggle('ch-wrap', true);

            var lines = 8, columns = 8;
            for (var ln = lines; ln > 0; ln--) {
                for (var cl = 0; cl < columns; cl++) {
                    var item = document.createElement('div');
                    var letter = letters[cl];
                    var id = letter + ln;
                    item.setAttribute('id', id);
                    wrapper.appendChild(item);
                    item.classList.add('ch-item');

                    if ((ln + cl) % 2)
                        item.classList.add('ch-black');

                    // Рендерим фигуру
                    if (figures.hasOwnProperty(id)) {
                        figures[id].render(item);
                    }

                    // Рисуем нумерацию столбцов
                    if (ln == 1) {
                        var labelColumn = document.createElement('div');
                        wrapper.appendChild(labelColumn);

                        labelColumn.innerHTML = letter;
                        labelColumn.classList.add('ch-label');
                        labelColumn.style.top = (lines * 70 + 1) + 'px';
                        labelColumn.style.left = (cl * 70) + 'px';
                    }
                }

                // Рисуем нумерацию строк
                var labelLine = document.createElement('div');
                wrapper.appendChild(labelLine);

                labelLine.classList.add('ch-label');
                labelLine.innerHTML = ln.toString();
                labelLine.style.top = (lines - ln) * 70 + 'px';
                labelLine.style.left = (columns * 70 + 1) + 'px';
            }

        };

        // Заполняет объект данных с фигурами
        this.init = function (data) {
            figures = {};

            data.forEach(function (val) {
                if (!( /^[A-H][1-8]$/.test(val.cell) )) {
                    throw "Неверная ячейка: " + val.cell;
                }

                if (figures.hasOwnProperty(val.cell)) {
                    throw "Несколько фигур в ячейке " + val.cell;
                }

                switch(val.figure) {
                    case 'Figure':
                    case 'FigureCastle':
                    case 'FigureKnight':
                    case 'FigureBishop':
                    case 'FigureQueen':
                    case 'FigureKing':
                        var figure = window[val.figure];
                        figures[val.cell] = new figure(val.cell, val.color == 'white');
                        break;
                    default:
                        throw "Неизвестный тип фигуры: " + val.figure;
                }
            }, this);

            if (rendered) {
                this.render();
            }
        };

    }

    window.Board = Board;
})();