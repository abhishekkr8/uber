const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL;
const interval = process.env.RELOAD_INTERVAL || 5; // Default to 5 minutes if not set

function reloadWebsite() {
  axios
    .get(SERVER_URL + "/reload")
    .then((response) => { })
    .catch((error) => {
      console.log("Error reloading server");
    });
}

function keepServerRunning() {
  setInterval(reloadWebsite, 60000 * interval);
}

module.exports = keepServerRunning;
