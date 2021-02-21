/**
 * @typedef Doujin
 * @property {String} title Doujin title
 * @property {Object} details
 * @property {Array} details.characters Doujin's characters
 * @property {Array} details.tags Doujin's tags
 * @property {Array} details.artists Doujin's artists
 * @property {Array} details.pages Doujin's pages
 * @property {String} link Doujin's link
 */
const nhentai = require("nhentai-js");
/**
 * Fetch doujin data
 *
 * @async
 *
 * @param {String} doujinId - Leave empty for random
 *
 * @return {Promise<Doujin>} Returns doujin if exists, else returns false
 *
 */
function getDoujin(doujinId = "random") {
    return new Promise(async (resolve, reject) => {
        if(doujinId == "random") {
            var homepage = await nhentai.getHomepage(1);
            var lastDoujin = homepage.results[0];
            doujinId = Math.floor(Math.random()*lastDoujin.bookId).toString();
        }
        if (nhentai.exists(doujinId)) {
            var doujin = await nhentai.getDoujin(doujinId);
            doujin.bookId = doujinId;
            resolve(doujin);
        } else reject(false);
    });

}

module.exports = getDoujin;