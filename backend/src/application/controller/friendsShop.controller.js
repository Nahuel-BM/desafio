
const config = require('config');
const Crawler = require("crawler");
const crawlerMaxConnections = config.get('Crawler.maxConnections');
const crawler = new Crawler({ maxConnections: crawlerMaxConnections });
const moment = require('moment');
const fs = require('fs');
let fetchedData = require('../../../data/friends_shop.json');

module.exports.get = async function (req, res, next) {
    res.json(fetchedData);
};

module.exports.getOneItem = async function (req, res, next) {
    let index = Number(req.params.index);
    if (isNaN(index) || index > fetchedData.result.length || index <= 0) {
        res.status(400).json({
            errorType: 'item not found'
        });
    } else {
        let item = fetchedData.result[index-1];
        res.json({
            result: [item],
            updated: fetchedData.updated
        });
    }
};

module.exports.updateData = async function (req, res, next) {
    startUpdate();
    res.json({ status: "initialized" });
}

async function startUpdate() {
    let uri = config.get('friends_shop.uri');
    crawler.queue({ uri: uri, callback: handlerCrawlerFunction });
}

async function saveToFile(items) {
    let file = config.get('friends_shop.file');
    fs.writeFile(file, JSON.stringify(items), (err) => {
        if (err) {
            console.log('File save error!')
        } else {
            console.log('The file has been saved!');
            fetchedData = require('../../../data/friends_shop.json');
        }
    });
}

function handlerCrawlerFunction(error, res, done) {
    let question = [];
    let response = [];
    if (error) {
        console.log(error);
    } else {
        var $ = res.$;
        $('.faq-title_question').each(function (i, elem) {
            question[i] = $(this).text();
        });

        $('.faq-text').each(function (i) {
            response[i] = cleanDataOfResponse($(this).text());
        });
    }
    done();
    let items = buildItems(question, response);
    saveToFile(items);
}

function buildItems(question, response) {
    let toSave = {
        result: [],
        updated: moment().format('YYYY-MM-DD HH:mm')
    }
    if (question.length === response.length) {
        toSave.result = question.map(function (val, i) {
            return {
                index: val,
                value: response[i]
            };
        })
    }
    return toSave;
}

function cleanDataOfResponse(data) {
    return data.replace("\\n", '').trim();
}