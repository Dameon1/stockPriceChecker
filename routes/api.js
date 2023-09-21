"use strict";

const { response } = require("express");

const stockModel = require("../models").Stock;


//??
async function saveStock(stock, like, ip) {
  console.log("Saving stock");
  let saved = {};
  const foundStock = await findStock(stock);
  console.log("foundstock",foundStock);
  if (!foundStock) {
    console.log("No stock found -",ip);
    const createSaved = await createStock(stock, like, ip);
    saved = createSaved;
    return saved;
  } else {
    console.log(foundStock);
    if (like === "true" && foundStock.likes.indexOf(ip) === -1) {
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}


//create a new stock for database
async function createStock(stock, like, ip) {
  console.log("Creating stock", like);
  const newStock = new stockModel({
    symbol: stock,
    likes: like === 'true' ? [ip] : [],
  });
  const savedNew = await newStock.save();
  console.log("savedNewStock", savedNew);
  return savedNew;
}

//check database for stock data
async function findStock(stock) {
  console.log("Finding stock");
  return await stockModel.findOne({ symbol: stock }).exec();
}


//api for stock price and symbol
async function getStockPrice(stock) {
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const { symbol, latestPrice } = await response.json();
  console.log(symbol, latestPrice);
  return { symbol, latestPrice };
}

module.exports = function (app) {

  app.route("/api/stock-prices").get(async function (req, res) {
    console.log( req.query.like)
    const { stock, like } = req.query;

if(Array.isArray(stock)) {
     
      const { symbol, latestPrice } = await getStockPrice(stock[0])
      const { symbol: symbol2, latestPrice: latestPrice2 } = await getStockPrice(stock[1])

      const firstStock = await saveStock(stock[0], like, req.ip)
      const secondStock = await saveStock(stock[1], like, req.ip)

      let stockData = [];
      if(!symbol) {
        stockData.push({
          rel_likes: firstStock.likes.length - secondStock.likes.length
        })
      } else {
        stockData.push({
          stock: symbol,
          price: latestPrice,
          rel_likes: firstStock.likes.length - secondStock.likes.length 
        })
      }
      if(!symbol2) {
        stockData.push({
          rel_likes: secondStock.likes.length - firstStock.likes.length
        })
      } else {
        stockData.push({
          stock: symbol2,
          price: latestPrice2,
          rel_likes: secondStock.likes.length - firstStock.likes.length
        })
      }
      res.json({
        stockData: stockData
      });
      return;
    }





    const { symbol, latestPrice } = await getStockPrice(stock);
    console.log(symbol)
    if (!symbol) {
      console.log(latestPrice,like)
      res.json({
        stockData: {
          likes: (like === true ? 3 : 0),
        },
      });
      return;
    }
    const oneStockData = await saveStock(symbol, like, req.ip)
    console.log("OneStockData",oneStockData)
    console.log(latestPrice, oneStockData.likes);

    res.json({
      stockData: {
        stock: symbol,
        price: latestPrice,
        likes: oneStockData.likes.length,
      }
    }

    )

    // console.log('anythin')
  });
};
