let module = {}; // Грязный хак, чтобы подгрузить модуль Basket

// Объект, который реализует логику всего приложения
class ApplicationBasket {
    /**
     * Запрашиваем у сервера данные о товарах и корзине
     * @param server - параметры для подключения к серверу
     */
    constructor(server) {
        this.pWrapper = null;
        this.bWrapper = null;
        this.server = server;

        let basketId = localStorage['basketId']; // Запрашиваем в хранилише
        if (!basketId)
            basketId = 0; // Сервер выдаст новый номер корзины

        // Запрашиваем информацию у сервера
        this.request('products', 'get', null, this.onLoadProducts);
        this.request('basket/' + basketId, 'get', null, this.onLoadBasket);
    }

    /**
     * Обработчик ответа сервера со списком товаров
     * @param data
     */
    onLoadProducts(data) {
        console.log('Products:', data.products);
        const pElement = $('.products');
        this.pWrapper = new ProductsWrapper(data.products);
        this.pWrapper.render(pElement);
        // Обработчики добавления товара, по-хорошему надо добавлять когда есть и товары и корзина
        pElement.on('click', 'button', this, ProductsWrapper.onBuy);
    }

    /**
     * Обработчик ответа сервера с корзиной
     * @param data
     */
    onLoadBasket(data) {
        console.log('Basket:', data.basket);
        localStorage['basketId'] = data.basket.id; // Сохраним в хранилище на будущее
        this.bWrapper = new BasketWrapper(data.basket);
        this.renderBasket();
        // Обработчики удаления товара
        $('.basket').on('click', 'button', this, BasketWrapper.onDel);
    }

    /**
     * Отрисовывает корзину по приходу данных с сервера
     */
    renderBasket() {
        const bElement = $('.basket');
        this.bWrapper.render(bElement);
    }

    /**
     * Обработчик удаления товара (от сервера)
     * @param data
     */
    onDelProduct(data) {
        console.log('Basket del product:', data.product);
        this.bWrapper.basket.delProduct(data.product.id);
        this.renderBasket();
    }

    /**
     * Обработчик добавления товара (от сервера)
     * @param data
     */
    onAddProduct(data) {
        console.log('Basket add product:', data.product);
        this.bWrapper.basket.addProduct(data.product);
        this.renderBasket();
    }

    /**
     * Функция для отправки запроса серверу
     * @param url
     * @param method
     * @param data
     * @param callback
     */
    request(url, method, data, callback) {
        $.ajax({
            url: `http://${this.server.host}:${this.server.port}/${url}`,
            method: method,
            data: data,
            dataType: 'json',
            success: function (data) {
                if (!data.result)
                    callback.call(this, data);
                else
                    throw new Error(data.message, data.result);
            },
            context: this
        });
    }
}

/**
 * Точка входа
 */
$(document).ready(() => new ApplicationBasket({
    host: 'localhost',
    port: 8888
}));