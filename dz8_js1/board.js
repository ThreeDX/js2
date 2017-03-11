;(function () {
    'use strict';

    // Хранилище удаленных фигур
    function DelStore(element) {
        // Элемент в который отрисовываем удаленные фигуры
        if (typeof element == "string") {
            var wrapper = document.getElementById(element);
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.id = element;
            }
        } else {
            wrapper = element;
        }
        wrapper.className = 'dels';

        var figures = [];

        this.getElement = function () {
            return wrapper;
        };

        this.render = function () {
            // удаляем все потомки у враппера
            while (wrapper.firstChild) {
                wrapper.removeChild(wrapper.firstChild);
            }

            figures.forEach(function (value) {
                var item = document.createElement('div');
                wrapper.appendChild(item);
                item.classList.add('ch-del');
                value.render(item);
            });
        };

        this.add = function(figure) {
            figures.push(figure);
            this.render();
        };

        this.remove = function (item) {
            var items = wrapper.querySelectorAll('div');
            var index = Array.prototype.indexOf.call(items, item);

            if (index >=0) {
                wrapper.removeChild(item);
                var figure = figures[index];
                figures.splice(index, 1);
                return figure;
            }

            return null;
        }

    }

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
        var deletedFiguresWhite = new DelStore('whites');
        var deletedFiguresBlack = new DelStore('blacks');
        var lastActive = null;

        this.setActive = setActive;
        this.removeFigure = removeFigure;

        // Отменяем выделение текста при кликах
        wrapper.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });

        // Обработчик стрелок
        document.body.addEventListener('keydown', function (e) {
            if (!lastActive) {
                if (e.keyCode == 32) {
                    setActive('A8');
                    e.preventDefault();
                }
                return;
            }

            var line = lastActive.id[1];
            var column = letters.indexOf(lastActive.id[0]);

            switch(e.keyCode) {
                case 37: // Влево
                    column = (column == 0) ? 7 : column - 1;
                    setActive(letters[column] + line);
                    e.preventDefault();
                    break;
                case 39: // Вправо
                    column = (column == 7) ? 0 : column + 1;
                    setActive(letters[column] + line);
                    e.preventDefault();
                    break;
                case 38: // Вверх
                    line = (line == 8) ? 1 : +line + 1;
                    setActive(letters[column] + line);
                    e.preventDefault();
                    break;
                case 40: // Вниз
                    line = (line == 1) ? 8 : line - 1;
                    setActive(letters[column] + line);
                    e.preventDefault();
                    break;
                case 32: // Пробел
                    setActive(lastActive.id);
                    e.preventDefault();
                    break;
                case 46: // Del
                    removeFigure(lastActive.id);
                    e.preventDefault();
                    break;
            }

        });

        // Активирует ячейку по id
        function setActive(id) {
            var oldActive = lastActive;
            var cell = document.getElementById(id);

            if (lastActive)
                lastActive.classList.remove('ch-active');

            if (lastActive != cell) {
                cell.classList.add('ch-active');
                lastActive = cell;
            } else
                lastActive = null;

            if (oldActive) {
                document.getElementById('active').innerHTML = '';
            }

            if (lastActive) {
                document.getElementById('active').innerHTML = lastActive.id;
            }
        }

        // Обработчик клика
        wrapper.addEventListener('click',function(e) {
            if (e.target.classList.contains('ch-item')) {
                setActive(e.target.id);
                return;
            }

            if (e.target.classList.contains('ch-del')) {
                restoreFigure(e.target);
            }
        });

        // Обработка нажатия правой кнопки мыши
        wrapper.addEventListener('contextmenu', function (e) {
            if (e.target.classList.contains('ch-item')) {
                removeFigure(e.target.id);
                e.preventDefault();
            }
        });

        // Убирает фигуру с доски
        function removeFigure(cell) {
            if (!figures.hasOwnProperty(cell))
                return false;

            if (figures[cell].isWhite()) {
                deletedFiguresWhite.add(figures[cell]);
            } else {
                deletedFiguresBlack.add(figures[cell]);
            }

            delete figures[cell];

            if(rendered) {
                var item = document.getElementById(cell);
                item.innerHTML = "";
            }
        }

        // Восстанавливает фигуру на доске
        function restoreFigure(element) {
            var store = deletedFiguresWhite;
            if (element.parentNode.id == 'blacks') {
                store = deletedFiguresBlack;
            }

            var figure = store.remove(element);
            if (figure) {
                figures[figure.cell()] = figure;
                figure.render(document.getElementById(figure.cell()));
            }
        }

        // Отрисовывает доску
        this.render = function () {
            rendered = true;

            // удаляем все потомки у враппера
            while (wrapper.firstChild) {
                wrapper.removeChild(wrapper.firstChild);
            }

            wrapper.classList.toggle('ch-wrap', true);

            // Добавляем блок для активной ячейки
            var active = document.createElement('div');
            active.id = 'active';
            active.className = 'ch-label';
            wrapper.appendChild(active);

            if (lastActive) {
                active.innerHTML = lastActive.id;
            }

            // Блок для удаленных фигур
            wrapper.appendChild(deletedFiguresBlack.getElement());
            wrapper.appendChild(deletedFiguresWhite.getElement());

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