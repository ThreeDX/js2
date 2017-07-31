// Простой сервер для поддержания работы корзины и отзывов
const restify = require('restify');
const cBasket = require('./js/basket.js');

const rest = restify.createServer({
    name: 'dz5-server'
});

// Любому запросу прописываем разрешение на работу
// с пользовательскими данными
rest.use((req, res, next) => {
    // Разрешаем обрабатывать ответ
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    // Разрешаем обрабатывать пользовательские данные
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
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
let reviews = [ // Отзывы
    {
        user: 'Вася',
        message: 'Здесь был Вася!',
        approve: true
    }
];

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



/////// ЗАПРОСЫ /////////

// Общий запрос
rest.get('/', (req, res) => res.send(200, {result: 0, message: 'OK'}));

// Запрос товаров
rest.get('/products', (req, res) => res.send(200, {result: 0, message: 'OK', products: products}));

// Запрос корзины
rest.get('/basket/:id', (req, res) => {
    return res.send(200, {result: 0, message: 'OK', basket: getBasket(req.params.id)})
});


// Получаем данные о коллекции
rest.get('/cars', function (req, res) {
    return res.send(200, {
        result: cars,
    });
});

// Создаем элемент в коллекции
rest.post('/cars', function (req, res) {
    if (!req.params || !req.params.type || !req.params.brand)
        return res.send(400, {});

    cars.push({
        id: cars.length + 1,
        type: req.params.type,
        brand: req.params.brand,
    });

    res.send(200, {result: 'ok!'});
});

// Удаляем элемент в коллекции
rest.del('/cars/:id', function (req, res) {
    var id = +req.params.id;
    var car = cars.filter(function (v) {
        return v.id === id;
    })[0];

    if (!car)
        return res.send(404, 'Нет такой машины!');

    cars = cars.filter(function (value) {
        return value.id !== id;
    });

    return res.send(200, {
        result: 'ok!',
    });
});

// Получаем информацию об элементе коллекции
rest.get('/cars/:id', function (req, res) {
    var id = +req.params.id;
    var car = cars.filter(function (v) {
        return v.id === id;
    })[0];

    if (!car)
        return res.send(404, 'Нет такой машины!');

    res.send(200, {
        result: car
    });
});

// Изменяем информацию об элементе коллекции
rest.put('/cars/:id', function (req, res) {
    if (!req.params.type || !req.params.brand)
        return res.send(400, 'Некорректный запрос!');

    var id = +req.params.id;
    var carIndex = -1;
    cars.forEach(function (v, i) {
        if (v.id === id)
            carIndex = i;
    });

    if (carIndex === -1)
        return res.send(404, 'Нет такой машины!');

    cars[carIndex] = {
        id: id,
        type: req.params.type,
        brand: req.params.brand,
    };

    return res.send(200, {
        result: 'ok!',
    });
});

rest.listen(8888, function () {
    console.log('API launched on 8888 port');
});
