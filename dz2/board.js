;(function () {
    'use strict';

    function Board(element, lines, columns, legend) {
        element = element || "board";
        lines = lines || 8;
        columns = columns || 8;
        legend = legend || false;

        // Элемент в который отрисовываем доску
        if (typeof element == "string") {
            this._wrapper = document.getElementById(element);
            if (!this._wrapper) {
                throw new Error("Элемент " + element + " не найден!");
            }
        } else {
            this._wrapper = element;
        }

        this._cellSize = 50; // Размер ячейки в пикселях
        this._lines = lines;
        this._columns = columns;
        this._drawLegend = legend;
        this._letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this._lastActive = null;
        this._rendered = false;

        // Обработчик клика
        this._wrapper.addEventListener('click',function(e) {
            if (!e.target.classList.contains('ch-item'))
                return;

            var oldActive = this._lastActive;

            if (this._lastActive)
                this._lastActive.classList.remove('ch-active');

            if (this._lastActive != e.target) {
                e.target.classList.add('ch-active');
                this._lastActive = e.target;
            } else
                this._lastActive = null;

            this.triggerEvent("activeCell", {
                oldCell: oldActive,
                newCell: this._lastActive
            });

        }.bind(this));
    }

    // Генерирует событие на доске
    Board.prototype.triggerEvent = function(name, detail, obj) {
        obj = obj || this._wrapper;

        obj.dispatchEvent(new CustomEvent(name, {
            detail: detail,
            bubbles: true,
            cancelable: false
        }));
    };

    // Меняет размер ячейки
    Board.prototype.setCellSize = function(size) {
        size = size || 50;
        this._cellSize = size;

        if (this._rendered)
            this.render();
    };

    // Меняет размер доски
    Board.prototype.setDimensions = function(lines, columns) {
        lines = lines || 8;
        columns = columns || 8;
        this._lines = lines;
        this._columns = columns;

        if (this._rendered)
            this.render();
    };

    // Вкл-выкл легенды
    Board.prototype.showLegend = function(legend) {
        legend = legend || false;
        this._drawLegend = legend;

        if (this._rendered)
            this.render();
    };

    // Отрисовывает доску
    Board.prototype.render = function () {
        this._rendered = true;

        // удаляем все потомки у враппера
        while (this._wrapper.firstChild) {
            this._wrapper.removeChild(this._wrapper.firstChild);
        }

        this._lastActive = null;

        this._wrapper.classList.toggle('ch-wrap', true);
        this._wrapper.style.width = (this._columns * this._cellSize) + 'px';
        this._wrapper.style.height = (this._lines * this._cellSize) + 'px';

        var i = 0;
        for (var ln = this._lines; ln > 0; ln--) {
            for (var cl = 0; cl < this._columns; cl++) {
                var item = document.createElement('div');

                var letter = this._letters[cl % this._letters.length];

                // Если столбцов больше букв, то добавляем цифру и разделитель в id
                if (cl >= this._letters.length) {
                    letter += Math.floor(cl / this._letters.length);
                    item.setAttribute('id', letter + '-' + ln);
                } else {
                    item.setAttribute('id', letter + ln);
                }

                this._wrapper.appendChild(item);
                item.style.width = this._cellSize + 'px';
                item.style.height = this._cellSize + 'px';
                item.style.lineHeight = this._cellSize + 'px';
                item.style.fontSize = Math.floor(this._cellSize / 2) + 'px';
                
                item.classList.add('ch-item');

                if (i && i % 2)
                    item.classList.add('ch-black');

                this.triggerEvent("renderCell", {
                    Cell: item
                });


                // Нужно для рисование в шахматном порядке квадратов
                if (this._columns%2 == 0)
                    i += ((i + 2) % (this._columns + 1) ) ? 1 : 2;
                else
                    i++;

                // Рисуем нумерацию столбцов
                if (this._drawLegend && ln == 1) {
                    var labelColumn = document.createElement('div');
                    this._wrapper.appendChild(labelColumn);

                    labelColumn.innerHTML = letter;
                    labelColumn.classList.add('ch-label');
                    labelColumn.style.top = (this._lines * this._cellSize + 1) + 'px';
                    labelColumn.style.left = (cl * this._cellSize) + 'px';
                    labelColumn.style.width = this._cellSize + 'px';
                    labelColumn.style.height = this._cellSize + 'px';
                    labelColumn.style.lineHeight = this._cellSize + 'px';
                    labelColumn.style.fontSize = Math.floor(this._cellSize / 2) + 'px';
                }
            }

            // Рисуем нумерацию строк
            if (this._drawLegend) {
                var labelLine = document.createElement('div');
                this._wrapper.appendChild(labelLine);

                labelLine.classList.add('ch-label');
                labelLine.innerHTML = ln.toString();
                labelLine.style.top = (this._lines - ln) * this._cellSize + 'px';
                labelLine.style.left = (this._columns * this._cellSize + 1) + 'px';
                labelLine.style.width = this._cellSize + 'px';
                labelLine.style.height = this._cellSize + 'px';
                labelLine.style.lineHeight = this._cellSize + 'px';
                labelLine.style.fontSize = Math.floor(this._cellSize/2) + 'px';
            }

        }
    };

    // Подписывание на события объекта, в котором доска
    Board.prototype.addEventListener = function(type,listener) {
        return this._wrapper.addEventListener(type,listener);
    };

    window.Board = Board;
})();