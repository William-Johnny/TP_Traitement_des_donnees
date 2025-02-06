const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const csv = require('csv-parser');

let scraperInfo = [];

const filePath = './videoGameDetailsAPI.csv';
const firstColumnValues = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const firstColumn = Object.values(row)[0];
    const noSpaceStr = firstColumn.replace(/\s+/g, '-');
    const no2dotsStr = noSpaceStr.replace(/:/g, '');
    const newStr = no2dotsStr.toLowerCase();
    firstColumnValues.push(newStr);
  })
  .on('end', () => {
    console.log(firstColumnValues);
    const csvFilePath = './videoGameDetailsScraper.csv';
    fs.writeFileSync(csvFilePath, "Summary\n");
    firstColumnValues.forEach(name => {
        console.log(name);
        axios.get(`https://www.ign.com/games/${name}`)
          .then(res => {
            const $ = cheerio.load(res.data);
        
            scraperInfo.push($('.object-summary-text.summary-info').text().trim());
            
            const makeFile = () => {
                console.log(scraperInfo);
                scraperInfo.forEach((el) => {
                    fs.appendFile(csvFilePath, `"${el}"\n`, (err) => {
                        if (err) {
                            console.error('Error appending to file:', err);
                        }
                    });
                });
            };
            if (scraperInfo.length > 0) { 
                makeFile();
            }
        });
    });
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });