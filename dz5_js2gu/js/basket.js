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
        const index = this.items.findIndex(p => p.id === productId);
        if (index >= 0) {
            const product = this.items.splice(index, 1);
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

        const product = this.items.find(p => p.id === productId);
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

module.exports = {
    Basket
};