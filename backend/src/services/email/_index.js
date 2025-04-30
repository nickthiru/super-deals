const prepareBulkEmailDestinations = require("./prepare-bulk-email-destinations");
const sendBulkEmail = require("./send-bulk-email");
const sendEmail = require("./send-email");
// Get the sendSimpleEmail function from the same module
// No need for separate import

module.exports = {
  sendEmail,
  // Use the sendSimpleEmail function from the sendEmail module
  sendSimpleEmail: sendEmail.sendSimpleEmail,
  sendBulkEmail,
  prepareBulkEmailDestinations,
};
