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
            if (!this._wrapper)
                throw new Error("Элемент " + element + " не найден!");
        }
        else
            this._wrapper = element;

        this._cellSize = 50; // Размер ячейки в пикселях
        this._lines = lines;
        this._columns = columns;
        this._drawLegend = legend;
        this._letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        this._lastActive = null;
        this._rendered = false;
    }

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
        if (!this._wrapper.classList.contains('ch-wrap'))
            this._wrapper.classList.add('ch-wrap');
        this._wrapper.style.width = (this._columns * this._cellSize) + 'px';
        this._wrapper.style.height = (this._lines * this._cellSize) + 'px';

        var i = 0, count = 0;
        while (count < this._lines * this._columns) {
            var item = document.createElement('div');
            this._wrapper.appendChild(item);
            item.style.width = this._cellSize + 'px';
            item.style.height = this._cellSize + 'px';

            item.classList.add('ch-item');
            item.addEventListener('click',function(e) {
                if (this._lastActive)
                    this._lastActive.classList.remove('ch-active');
                if (this._lastActive != e.target) {
                    e.target.classList.add('ch-active');
                    this._lastActive = e.target;
                }
                else
                    this._lastActive = null;
            }.bind(this));

            if (i && i % 2)
                item.classList.add('ch-black');

            // Нужно для рисование в шахматном порядке квадратов
            if (this._columns%2 == 0)
                i += ((i + 2) % (this._columns + 1) ) ? 1 : 2;
            else
                i++;

            count++;

            // Рисуем нумерацию строк и столбцов
            if (count % this._columns == 0 && this._drawLegend) {
                var labelLine = document.createElement('div');
                this._wrapper.appendChild(labelLine);

                labelLine.classList.add('ch-label');
                var line = Math.floor(count/this._columns);
                labelLine.innerHTML = (this._lines + 1 - line).toString();
                labelLine.style.top = (line - 1) * this._cellSize + 'px';
                labelLine.style.left = (this._columns * this._cellSize + 1) + 'px';
                labelLine.style.width = this._cellSize + 'px';
                labelLine.style.height = this._cellSize + 'px';
                labelLine.style.lineHeight = this._cellSize + 'px';
                labelLine.style.fontSize = Math.floor(this._cellSize/2) + 'px';
            }
            if (count > this._columns * (this._lines - 1) && this._drawLegend) {
                var labelColumn = document.createElement('div');
                this._wrapper.appendChild(labelColumn);

                labelColumn.classList.add('ch-label');
                var column = Math.floor(count%this._columns);
                labelColumn.innerHTML = (column >= this._letters.length)?this._letters[column%this._letters.length] + Math.floor(column/this._letters.length):this._letters[column];
                labelColumn.style.top = (this._lines * this._cellSize + 1) + 'px';
                labelColumn.style.left = (column * this._cellSize) + 'px';
                labelColumn.style.width = this._cellSize + 'px';
                labelColumn.style.height = this._cellSize + 'px';
                labelColumn.style.lineHeight = this._cellSize + 'px';
                labelColumn.style.fontSize = Math.floor(this._cellSize/2) + 'px';
            }
        }
    };

    // Подписывание на события объекта, в котором доска
    Board.prototype.addEventListener = function(type,listener) {
        return this._wrapper.addEventListener(type,listener);
    };

    // Шахматная доска
    function ChessBoard(element) {
        Board.call(this, element, 8, 8, true);
    }

    ChessBoard.prototype = Object.create(Board.prototype);
    ChessBoard.prototype.constructor = ChessBoard;

    // Устанавливает активную ячейку по номеру или возвращает текущую активную ячейку
    ChessBoard.prototype.activeCell = function (cell) {
        if (!this._rendered)
            return null;
        // Получаем массив элементов
        var childs = Array.prototype.slice.call(this._wrapper.getElementsByClassName('ch-item'));
        // Нужно вернуть номер текущей активной ячейки
        if (!cell && this._lastActive) {
            // Определяем порядковый номер ячейки и по нему вычисляем строку и колонку
            var elementNum = childs.indexOf(this._lastActive) + 1;
            var line = (elementNum % this._columns)?this._lines - Math.floor(elementNum / this._columns):this._lines - Math.floor(elementNum / this._columns) + 1;
            var column = (elementNum % this._columns)? elementNum % this._columns - 1: this._columns - 1;
            column = this._letters[column];
            return column+line;
        }
        // По координатам определяем порядковый номер ячейки
        if(typeof cell == "string" && /^[A-H]{1}[1-8]{1}$/.test(cell)) {
            column = this._letters.indexOf(cell.charAt(0)) + 1;
            line = this._lines - cell.charAt(1);
            elementNum = line * this._columns + column;
            var element = childs[elementNum -1];

            if (this._lastActive)
                this._lastActive.classList.remove('ch-active');
            if (this._lastActive != element) {
                element.classList.add('ch-active');
                this._lastActive = element;
            }
            else
                this._lastActive = null;
            return true;
        }
        return null;
    };

    // Отключаем изменение размеров и отключение легенды для шахматной доски
    ChessBoard.prototype.setDimensions = function () {};
    ChessBoard.prototype.showLegend = function () {};

    window.Board = Board;
    window.ChessBoard = ChessBoard;
})();