const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const Company = require('./models/Company'); // Assurez-vous que ce chemin est correct

// Connexion à MongoDB
mongoose.connect('mongodb+srv://omarmufti:HA9oHhoasfMVw6zm@cluster0.30sjck4.mongodb.net/kbo?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const INITIAL_SAMPLE_SIZE = 2000; // Nombre initial d'entreprises à échantillonner
const TARGET_COMPANIES = 1000; // Nombre cible d'entreprises à importer
const companies = {};
const companyNumbers = new Set();

// Fonction pour échantillonner les données
const sampleData = (inputFile, callback) => {
  const results = [];
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      const sampled = results.sort(() => 0.5 - Math.random()).slice(0, INITIAL_SAMPLE_SIZE);
      sampled.forEach(row => companyNumbers.add(row.EntityNumber));
      callback();
    });
};

// Fonction pour filtrer les données en fonction des numéros d'entreprise échantillonnés
const filterData = (inputFile, callback) => {
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      if (companyNumbers.has(row.EntityNumber)) {
        const entityNumber = row.EntityNumber;
        if (!companies[entityNumber]) {
          companies[entityNumber] = { companyNumber: entityNumber };
        }
        if (inputFile.includes('denomination')) {
          companies[entityNumber].companyName = row.Denomination;
        }
        if (inputFile.includes('activity')) {
          companies[entityNumber].activity = row.Classification || row.NaceCode || "Not Provided";
        }
        if (inputFile.includes('address')) {
          const address = `${row.StreetNL || ''} ${row.HouseNumber || ''} ${row.Box || ''}, ${row.Zipcode || ''} ${row.MunicipalityNL || ''}, ${row.CountryNL || ''}`;
          companies[entityNumber].address = address.trim() ? address : "Not Provided";
        }
      }
    })
    .on('end', callback);
};

// Échantillonner les données de denomination.csv
sampleData('denomination.csv', () => {
  // Filtrer les autres fichiers CSV en utilisant les numéros d'entreprise échantillonnés
  filterData('denomination.csv', () => {
    filterData('activity.csv', () => {
      filterData('address.csv', async () => {
        console.log('Data filtering complete');

        // Sauvegarder les données filtrées dans MongoDB
        let savedCount = 0;
        for (const key in companies) {
          const companyData = companies[key];
          
          // Vérifier si tous les champs requis sont présents
          if (!companyData.activity || !companyData.address || !companyData.companyName) {
            console.error(`Skipping company ${companyData.companyNumber} due to missing fields.`);
            continue;
          }

          const company = new Company(companyData);
          try {
            await company.save();
            console.log(`Company ${companyData.companyNumber} saved successfully`);
            savedCount++;
            if (savedCount >= TARGET_COMPANIES) {
              break;
            }
          } catch (error) {
            console.error(`Error saving company ${companyData.companyNumber}:`, error.message);
          }
        }

        console.log(`All data imported successfully, ${savedCount} companies saved.`);
        mongoose.connection.close();
      });
    });
  });
});
