import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export default async function handler(req, res) {
  const {
    query: { filename },
  } = req;

  const csvFilePath = path.join(process.cwd(), 'posts', 'data', `${filename}.csv`);
  const data = [];

  try {
    const readStream = fs.createReadStream(csvFilePath);

    readStream
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        res.status(200).json(data);
      })
      .on('error', (err) => {
        res.status(500).json({ message: 'Erreur lors de la lecture du fichier CSV.' });
      });

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la lecture du fichier CSV.' });
  }
}
