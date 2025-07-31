const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL;
const interval = process.env.RELOAD_INTERVAL || 5; // Default to 5 minutes if not set

function reloadWebsite() {
  axios
    // .get(SERVER_URL + "/reload")
    .get(`${SERVER_URL}/reload`)
    .then((response) => { console.log("Reloaded server"); })
    .catch((error) => {
      console.log("Error reloading server", error.message);
    });
}

function keepServerRunning() {
  console.log(`Keep-alive interval set to every ${interval} minute(s)`);
  setInterval(reloadWebsite, 60000 * interval);
}

module.exports = keepServerRunning;
