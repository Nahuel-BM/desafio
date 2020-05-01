const express = require('express');
const router = express.Router();

const FriendsShopController = require('../application/controller/friendsShop.controller');

router
    .route('/friendshop')
    .get(FriendsShopController.get);

router
    .route('/friendshop/:index')
    .get(FriendsShopController.getOneItem);

router
    .route('update')
    .get(FriendsShopController.updateData);

module.exports = router;