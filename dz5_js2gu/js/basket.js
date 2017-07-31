// Корзина, работает на сервере и на клиенте
class Basket {
    /**
     * Создается пустая корзина с заданным номером
     * @param id
     */
    constructor(id) {
        this.id = id;
        this.count = 0;
        this.price = 0;
        this.items = [];
    }

    /**
     * Добавляет продукт в корзину
     * @param product
     * @param count
     * @returns {boolean}
     */
    addProduct(product, count = 1) {
        this.count += count;
        this.price += product.price * count;
        let item = this.items.find(p => p.id === product.id);
        if (item) {
            item.count += count;
        } else {
            product.count = count;
            this.items.push(product);
        }
        return true;
    }

    /**
     * Удаляет продукт из корзины
     * @param productId
     * @returns {boolean}
     */
    delProduct(productId) {
        const index = this.items.findIndex(p => p.id == productId);
        if (index >= 0) {
            const product = this.items.splice(index, 1)[0];
            this.count -= product.count;
            this.price -= product.price * product.count;
            return true;
        }
        return false;
    }

    /**
     * Меняет количество товара в корзине, если 0 - то удаляет товар из корзины
     * @param productId
     * @param count
     * @returns {boolean}
     */
    setProductCount(productId, count) {
        if (count == 0)
            return this.delProduct(productId);

        const product = this.items.find(p => p.id == productId);
        if (count > 0 && product) {
            const delta = count - product.count;
            this.count += delta;
            this.price += delta * product.price;
            product.count = count;
            return true;
        }
        return false;
    }

    /**
     * Очищает всю корзину
     */
    clear() {
        this.count = 0;
        this.price = 0;
        this.items = [];
    }

    /**
     * Инициализирует данными корзины, используется на клиенте
     * @param basket
     */
    init(basket) {
        this.count = basket.count;
        this.price = basket.price;
        this.items = basket.items;
        this.id = basket.id;
    }
}

// Корзина на стороне клиента
class BasketWrapper {
    /**
     * Создает корзину на основании данных от сервера
     * @param basket
     */
    constructor(basket) {
        this.basket = new Basket(basket.id);
        this.init(basket);
    }

    /**
     * Инициализирует корзину
     * @param basket
     */
    init(basket) {
        this.basket.init(basket);
    }

    /**
     * Отрисовывает корзину
     * @param $element
     */
    render($element) {
        $element.empty();

        let html = `<div class="summary">Корзина пока пуста, добавьте товар.</div>`;
        if (this.basket.count) {
            html = `<div class="summary">Товаров в корзине <span>${this.basket.count}</span> на сумму <span>${this.basket.price}</span> руб.</div>
        <table class="items"><tr><th>Артикул</th><th>Товар</th><th>Цена</th><th>Количество</th><th>Сумма</th><th></th></tr>`;

            this.basket.items.forEach((i) => {
                html += `<tr><td>${i.id}</td><td><img src="img/${i.id}.jpg" alt="${i.name}"/> ${i.name}</td>
                    <td>${i.price} руб.</td><td>${i.count}</td><td>${i.count * i.price} руб.</td>
                    <td><button id="bp_${i.id}">X</button></td></tr>`;
            });

            html += `<tr><td colspan="4">Итого:</td><td>${this.basket.price} руб.</td><td></td></tr></table>`;
        }

        const basket = $('<div/>', {
            id: `basket_${this.basket.id}`
        }).html(html);
        basket.appendTo($element);
    }

    /**
     * Обработчик клика по удаляемому продукту
     * @param event
     */
    static onDel(event) {
        const productId = event.target.id.split('_')[1];
        const context = event.data;
        // Посылаем запрос к серверу на удаление
        context.request('basket/'+context.bWrapper.basket.id, 'delete', {product: {id: productId}}, context.onDelProduct);
    }

}

module.exports = {
    Basket
};