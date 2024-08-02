const router = require('express').Router();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const Enterprise = require('./models/enterprise.model');
const Activity = require('./models/activity.model');
const Address = require('./models/address.model');
const Branch = require('./models/branch.model');
const Code = require('./models/code.model');
const Contact = require('./models/contact.model');
const Denomination = require('./models/denomination.model');
const Establishment = require('./models/establishment.model');

// Fonction pour insérer des documents en lots
const insertDocumentsInBatches = async (Model, documents, batchSize) => {
  while (documents.length > 0) {
    const batch = documents.splice(0, batchSize);
    await Model.insertMany(batch);
    console.log(`${batch.length} documents insérés avec succès`);
  }
};

// Route pour traiter le fichier CSV enterprise
router.get('/enterprise', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/enterprise.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EnterpriseNumber: row['EnterpriseNumber'],
          juridical: {
            status: row['Status'],
            legal_form: row['JuridicalForm'],
            capital: row['Capital']
          }
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Enterprise, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Enterprise, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV activity
router.get('/activity', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/activity.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EntityNumber: row['EntityNumber'],
          ActivityGroup: row['ActivityGroup']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Activity, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Activity, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV address
router.get('/address', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/address.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EntityNumber: row['EntityNumber'],
          CountryFR: row['CountryFR'],
          MunicipalityFR: row['MunicipalityFR'],
          StreetFR: row['StreetFR'],
          HouseNumber: row['HouseNumber']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Address, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Address, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV branch
router.get('/branch', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/branch.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Validation des champs requis
        if (row['Id'] && row['EnterpriseNumber'] && row['StartDate']) {
          const document = {
            Id: row['Id'],
            EnterpriseNumber: row['EnterpriseNumber'],
            StartDate: row['StartDate']
          };
          documents.push(document);
        } else {
          console.warn('Ligne ignorée à cause de champs manquants:', row);
        }

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Branch, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Branch, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV code
router.get('/code', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/code.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          Code: row['Code'],
          Category: row['Category'],
          Language: row['Language'],
          Description: row['Description']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Code, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Code, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV contact
router.get('/contact', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/contact.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EntityNumber: row['EntityNumber'],
          ContactType: row['ContactType'],
          Value: row['Value']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Contact, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Contact, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV denomination
router.get('/denomination', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/denomination.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EntityNumber: row['EntityNumber'],
          TypeOfDenomination: row['TypeOfDenomination'],
          Denomination: row['Denomination']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Denomination, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Denomination, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

// Route pour traiter le fichier CSV establishment
router.get('/establishment', async (req, res, next) => {
  try {
    const csvFilePath = './dataset/establishment.csv';
    const batchSize = 1000;
    let documents = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const document = {
          EstablishmentNumber: row['EstablishmentNumber'],
          StartDate: row['StartDate'],
          EnterpriseNumber: row['EnterpriseNumber']
        };

        documents.push(document);

        if (documents.length >= batchSize) {
          const batch = documents;
          documents = [];
          insertDocumentsInBatches(Establishment, batch, batchSize).catch(console.error);
        }
      })
      .on('end', async () => {
        if (documents.length > 0) {
          try {
            await insertDocumentsInBatches(Establishment, documents, batchSize);
          } catch (err) {
            console.error('Erreur lors de l\'insertion des documents restants :', err);
          }
        }
        console.log('Fichier CSV traité avec succès');
        res.send('CSV file successfully processed and data inserted into the database');
      })
      .on('error', (err) => {
        console.error('Erreur lors de la lecture du fichier CSV :', err);
        res.status(500).send('Error processing CSV file');
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
