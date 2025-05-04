const prepareBulkEmailDestinations = require("./prepare-bulk-email-destinations");
const sendBulkEmail = require("./send-bulk-email");
const sendEmail = require("./send-email");

module.exports = {
  sendEmail,
  sendBulkEmail,
  prepareBulkEmailDestinations,
};
