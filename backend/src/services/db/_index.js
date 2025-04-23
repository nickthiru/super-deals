// const deleteItem = require("./item-method/delete-item");
const saveItem = require("./item-methods/save-item");
// const latestPriceDateTime = require("./query-methods/latest-price-date-time");
// const latestPrice = require("./query-methods/latest-price");
// const emailAlertSubscribers = require("./query-methods/email-alert-subscribers");

// require("dotenv").config();

module.exports = {
  // Item operations
  item: {
    saveItem,
    // deleteItem,
  },
  // Query operations
  query: {
    // latestPrice,
    // latestPriceDateTime,
    // emailAlertSubscribers,
  },
};
