const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let tab_quotes = [];
const authorNames = [];
let test =[];

axios.get(`https://www.ign.com/reviews/games`)
  .then(res => {
    results = res.data;
    const $ = cheerio.load(results);
    const gameReviewLinks = $('.main-content > a');
   
    gameReviewLinks.each((index,element) => {
      test.push($(element).attr('href'));
    });

    
    const csvFilePath = './links.csv';
    
    fs.writeFileSync(csvFilePath, `Links\n`);
    
    let i = 0;
    let t = 1;
    const makeFile = () => {
    //   newText='';
    //   for (let n = 0; n < test.length; n++) {
    //     if (test[i] === undefined || test[t] === undefined) {
    //       continue;
    //     }
    //     tab_quotes.push([test[i],test[t]]);
        
    //     i=i+2;
    //     t=t+2;
    //   }

        test.forEach((el)=>{
            fs.appendFile(csvFilePath, `"${el}"\n`, (err) => {
            if (err) {
                console.error('Error appending to file:', err);
            }
            });
        });

    //   tab_quotes.forEach((element) => {
        
    //     if (element[2] !== undefined) {
    //       newText = element[2].replace(/(\r\n|\n|\r)/gm, "");
    //     }else{
    //       newText = "no data";
    //     }
        
    //     fs.appendFile(csvFilePath, `"${element[0]}","${element[1]}","${newText}"\n`, (err) => {
    //       if (err) {
    //         console.error('Error appending to file:', err);
    //       }
    //     });
    //   });
    }

    setTimeout(() => {
        makeFile()
    }, 5000);
  })
// for (let x = 1; x <= 10; x++) {
// }