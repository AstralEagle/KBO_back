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

// Route pour rechercher par EnterpriseNumber dans la table des enterprises
router.get('/search/by-enterprise-number/:enterpriseNumber', async (req, res, next) => {
  try {
    const enterpriseNumber = req.params.enterpriseNumber;
    const enterprise = await Enterprise.findOne({ EnterpriseNumber: enterpriseNumber });
    if (enterprise) {
      res.json(enterprise);
    } else {
      res.status(404).send('Enterprise not found');
    }
  } catch (error) {
    next(error);
  }
});

// Route pour rechercher par Denomination dans la table denominations
router.get('/search/by-denomination/:denomination', async (req, res, next) => {
  try {
    const denomination = req.params.denomination;
    const denominations = await Denomination.find({ Denomination: new RegExp(denomination, 'i') });
    if (denominations.length > 0) {
      res.json(denominations);
    } else {
      res.status(404).send('Denomination not found');
    }
  } catch (error) {
    next(error);
  }
});

// Nouvelle route pour rechercher par EntityNumber dans la table address
router.get('/search/by-entity-number/address/:entityNumber', async (req, res, next) => {
  try {
    const entityNumber = req.params.entityNumber;
    const addresses = await Address.find({ EntityNumber: entityNumber });
    if (addresses.length > 0) {
      res.json(addresses);
    } else {
      res.status(404).send('Address not found');
    }
  } catch (error) {
    next(error);
  }
});

// Nouvelle route pour rechercher par EntityNumber dans la table activity
router.get('/search/by-entity-number/activity/:entityNumber', async (req, res, next) => {
  try {
    const entityNumber = req.params.entityNumber;
    const activities = await Activity.find({ EntityNumber: entityNumber });
    if (activities.length > 0) {
      res.json(activities);
    } else {
      res.status(404).send('Activity not found');
    }
  } catch (error) {
    next(error);
  }
});

// Route pour récupérer les 20 premières entreprises
router.get('/enterprises/top20', async (req, res, next) => {
  try {
    const topEnterprises = await Enterprise.find().limit(20);
    res.json(topEnterprises);
  } catch (error) {
    next(error);
  }
});

// Rechercher par numéro d'entreprise via scrapping
router.get('/search/scrapping/:companyNumber', async (req, res) => {
  try {
    const company = await companyScrapper(req.params.companyNumber);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
