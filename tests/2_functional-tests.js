const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('5 Functional Tests', function() {
        test("Viewing one stock: GET request to /api/stock-prices/", function(done) {
            chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock:'tsla'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'TSLA');
                assert.exists(res.body.stockData.price, 'TSLA has a price')
                done()
            })
        })

        test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done){
            chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock:'gold', like: 'true'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'GOLD');
                assert.equal(res.body.stockData.likes, 1);
                assert.exists(res.body.stockData.price, 'GOLD has a price')
                done()
            }) 
        })

        test('Viewing one stock and liking it again: GET request to /api/stock-prices/', function(done){
            chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock:'gold'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'GOLD');
                assert.equal(res.body.stockData.likes, 1);
                assert.exists(res.body.stockData.price, 'GOLD has a price')
                done()
            }) 
        })

        test('Viewing two stocks: GET request to /api/stock-prices/', function(done){
            chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock:['nvda','amd']})
            .end(function(err, res) {
                console.log(res.body)
                assert.equal(res.status, 200);
                
                assert.equal(res.body.stockData[1].stock, "AMD");
                assert.equal(res.body.stockData[0].stock, 'NVDA');
                assert.exists(res.body.stockData[0].price, 'NVDA has a price')
                assert.exists(res.body.stockData[1].price, 'AMD has a price')
                done()
            }) 
        })

        test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done){
            chai
            .request(server)
            .get('/api/stock-prices/')
            .query({stock:['nvda','amd'], like: 'true'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                //console.log(res.body.stockData.stock)
                assert.equal(res.body.stockData[0].stock, 'NVDA');
                assert.equal(res.body.stockData[1].stock, 'AMD');
                assert.exists(res.body.stockData[0].price, 'NVDA has a price')
                assert.exists(res.body.stockData[1].price, 'AMD has a price')
                done()
            }) 
        })

        






    })
// Viewing one stock: GET request to /api/stock-prices/

// Viewing one stock and liking it: GET request to /api/stock-prices/

// Viewing the same stock and liking it again: GET request to /api/stock-prices/

// Viewing two stocks: GET request to /api/stock-prices/

// Viewing two stocks and liking them: GET request to /api/stock-prices/






});
