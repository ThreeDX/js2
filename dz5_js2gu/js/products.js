// Отдельный продукт
class Product {
    /**
     * Создаем объект продукта
     * @param product
     */
    constructor(product) {
        this.id = product.id;
        this.price = product.price;
        this.name = product.name;
    }

    /**
     * Отрисовка продукта на странице
     * @returns {*|jQuery}
     */
    render() {
        return $('<div/>', {
            id: `product_${this.id}`,
            class: 'product'
        }).html(`<img src="img/${this.id}.jpg" alt="${this.name}" class="icon">
            <div class="name">${this.name}</div>
            <div class="price">${this.price} <span>руб.</span></div>
            <button class="buy">Купить</button>`);
    }
}

// Коллекция продуктов, загруженных с сервера. Блок на странице со списком продуктов
class ProductsWrapper {
    /**
     * Создает продукты на основании присланных данных от сервера
     * @param products
     */
    constructor(products) {
        this.items = products.map((p) => new Product(p));
    }

    /**
     * Отрисовывает продукты на странице
     * @param $element
     */
    render($element) {
        $element.empty();
        this.items.forEach((i) => i.render().appendTo($element));

        //$element.on('click', 'button', this, Products.onBuy);
    }

    /*static onBuy(event) {
     console.log(event);
     console.log(event.target.parentNode.id.split('_')[1]);
     }*/
}
