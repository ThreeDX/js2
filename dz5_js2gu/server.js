// Простой сервер для поддержания работы корзины и отзывов
const restify = require('restify');
const cBasket = require('./js/basket.js');

const rest = restify.createServer({
    name: 'dz5-server'
});
rest.use(restify.plugins.bodyParser());

// Любому запросу прописываем разрешение на работу
// с пользовательскими данными
rest.use((req, res, next) => {
    // Разрешаем обрабатывать ответ
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    // Разрешаем обрабатывать пользовательские данные
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Определяем обработку предварительных запросов
rest.opts('.*', function(req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');

    res.send(204);
});


// Определяем коллекцию для хранения данных
const products = [ // Товары
    {
        id: 1,
        name: 'Ложка',
        price: 15.00
    },
    {
        id: 2,
        name: 'Вилка',
        price: 10.00
    },
    {
        id: 3,
        name: 'Нож',
        price: 20.00
    }
];
let baskets = []; // Корзины

/**
 * Возвращает корзину или создает новую, если такой еще нет
 * @param id
 * @returns {*}
 */
function getBasket(id) {
    id = parseInt(id);
    let basket = baskets.find((b) => b.id === id);
    if (!basket) {
        basket = new cBasket.Basket(baskets.length + 1);
        baskets.push(basket);
    }
    return basket;
}

/**
 * Возвращает товар по номеру
 * @param id
 * @returns {*|undefined}
 */
function getProduct(id) {
    id = parseInt(id);
    return products.find((p) => p.id === id);
}


/////// ЗАПРОСЫ /////////

// Общий запрос
rest.get('/', (req, res) => res.send(200, {result: 0, message: 'OK'}));

// Запрос товаров
rest.get('/products', (req, res) => res.send(200, {result: 0, message: 'OK', products: products}));

// Запрос корзины
rest.get('/basket/:id', (req, res) => {
    console.log('basket request:', req.params.id);
    return res.send(200, {result: 0, message: 'OK', basket: getBasket(req.params.id)})
});

// Добавляем товар в корзину
rest.post('/basket/:id', function (req, res) {
    if (!req.params || !req.params.id || !req.body || !req.body.product)
        return res.send(200, {result: 1, message: 'Incorrect request'});

    const basket = getBasket(req.params.id);
    const product = getProduct(req.body.product);
    console.log('basket add product request:', req.params.id, product);
    if (product && basket.addProduct(product))
        return res.send(200, {result: 0, message: 'OK', product: product});

    return res.send(200, {result: 2, message: 'Product not added'});
});

// Удаляем товар из корзины
rest.del('/basket/:id', function (req, res) {
    if (!req.params || !req.params.id || !req.body || !req.body.product)
        return res.send(200, {result: 1, message: 'Incorrect request'});

    const basket = getBasket(req.params.id);
    console.log('basket del product request:', req.params.id, req.body.product);
    if (basket.delProduct(req.body.product.id))
        return res.send(200, {result: 0, message: 'OK', product: {id: req.body.product.id}});

    return res.send(200, {result: 3, message: 'Product not deleted'});
});

rest.listen(8888, function () {
    console.log('API launched on 8888 port');
});
