const GuestPersonApp = require("./classes/GuessPersonApp");
const guessPerson = new GuestPersonApp();
module.exports = guessPerson;
require("./mongo");
require("./middleware");
require("./socketHandlers");









