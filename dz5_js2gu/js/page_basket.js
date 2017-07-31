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

        // Запрашиваем информацию у сервера
        this.request('products', 'get', null, this.onLoadProducts);
        this.request('basket/1', 'get', null, this.onLoadBasket);
    }

    /**
     * Обработчик ответа сервера со списком товаров
     * @param data
     */
    onLoadProducts(data) {
        console.log('Products:', data.products);
        this.pWrapper = new ProductsWrapper(data.products);
        this.pWrapper.render($('.products'));
    }

    /**
     * Обработчик ответа сервера с корзиной
     * @param data
     */
    onLoadBasket(data) {
        console.log('Basket:', data.basket);
        this.bWrapper = new Basket(data.basket.id);
        this.bWrapper.init(data.basket);
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