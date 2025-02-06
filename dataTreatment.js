const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let reviewLinks = [];
let gameDetailsTab = [];

const getGameIdByName = async (gameName) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/games?key=3fa07b920e8044a2b6a5e8daebbb34a4&search=${encodeURIComponent(gameName)}`);
        if (response.data.results.length > 0) {
            return response.data.results[0].id;
        } else {
            console.log('No game found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching game ID:', error);
        return null;
    }
};

const getGameDetails = async (id) => {
    if (!id) return null;
    try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=3fa07b920e8044a2b6a5e8daebbb34a4`);
        const details = response.data;
        return [details.name, details.released, details.playtime];
    } catch (error) {
        console.error('Error fetching game details:', error);
        return null;
    }
};

const fetchReviewsAndWriteToFile = async () => {
    try {

        const csvFilePath = './videoGameDetailsAPI.csv';
        fs.writeFileSync(csvFilePath, `Name, Date, Playtime\n`);

        const gameId = await getGameIdByName("The Witcher 3");
        if (!gameId) return;

        const gameDetails = await getGameDetails(gameId);
        if (gameDetails) {
            gameDetailsTab.push(gameDetails);
        }

        gameDetailsTab.forEach((el) => {
            fs.appendFile(csvFilePath, `"${el[0]}","${el[1]}", "${el[2]}"\n`, (err) => {
                if (err) {
                    console.error('Error appending to file:', err);
                }
            });
        });

        console.log('Data successfully saved!');
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

// Run the function
fetchReviewsAndWriteToFile();
