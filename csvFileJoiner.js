const fs = require('fs');
const csv = require('csv-parser');
const { parse } = require('json2csv');

const file1 = './videoGameDetailsAPI.csv';
const file2 = './videoGameDetailsScraper.csv';
const outputFile = 'merged.csv';

const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', (err) => reject(err));
    });
};

Promise.all([readCSV(file1), readCSV(file2)])
    .then(([data1, data2]) => {
        // Merge headers
        const mergedHeaders = [...new Set([...Object.keys(data1[0]), ...Object.keys(data2[0])])];

        // Merge row values
        const mergedData = data1.map((row, index) => ({
            ...row,
            ...data2[index] // Merge corresponding row from file2
        }));

        // Convert to CSV format
        const csvContent = parse(mergedData, { fields: mergedHeaders });

        // Write to new CSV file
        fs.writeFileSync(outputFile, csvContent, 'utf8');
        console.log(`Merged CSV saved as ${outputFile}`);
    })
    .catch(err => console.error('Error merging CSV files:', err));
