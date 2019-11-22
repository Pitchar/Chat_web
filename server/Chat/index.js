var express = require('express');
var Storage = require('../Storage');
var Router = express.Router();

Router.get('/users', function (req, res) {
    Storage.getData('users')
        .then(function (users) {
            res.json(users);
        }).catch(function (error) {
            res.sendStatus(500).json(error);
        });
});

Router.get('/messages', function (req, res) {
    Storage.getData('messages')
        .then(function (messages) {
            res.json(messages);
        }).catch(function (error) {
            res.sendStatus(500).json(error);
        });
});

Router.post('/users', function (req, res) {
    var user = req.body.users;
    
    Storage.getData('users')
        .then(function (users) {
            return new Promise(function (resolve, reject) {
                Storage.saveData('users', user, users)
                    .then(function (message) {
                        resolve(message);
                    }).catch(function (err) {
                        reject(err);
                    })
            })
        }).then(function (message) {
            res.json(message);
        }).catch(function (err) {
            res.sendStatus(500).json(err);
        })
});

Router.post('/messages', function (req, res) {
    var message = req.body.message;

    Storage.getData('messages')
        .then(function (messages) {
            return new Promise(function (resolve, reject) {
                Storage.saveData('messages', message, messages)
                    .then(function (message) {
                        resolve(message);
                    }).catch(function (err) {
                        reject(err);
                    })
            })
        }).then(function (message) {
            res.json(message);
        }).catch(function (err) {
            res.sendStatus(500).json(err);
        })
});

module.exports = Router;