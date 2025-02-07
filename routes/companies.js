const express = require('express');
const router = express.Router();
const Company = require('../models/Company.model');
const companyScrapper = require('../scrapping/companyScrapper');

// Recuparation unique par numéro d'entreprise
router.get('/unique/:companyNumber', async (req, res) => {
  try {
    const company = await Company.findOne({ companyNumber: req.params.companyNumber });
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Rechercher par numéro d'entreprise via scrapping
router.get('/search/scrapping/:companyNumber', async (req, res) => {
  try {
    const company = await companyScrapper(req.params.companyNumber.replaceAll(".", ""));
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rechercher par numéro d'entreprise
router.get('/search/number/:companyNumber', async (req, res) => {
  try {
    const company = await Company.find({ companyNumber: { $regex: req.params.companyNumber, $options: 'i' } }).limit(20);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rechercher par nom d'entreprise
router.get('/search/name/:companyName', async (req, res) => {
  try {
    const companies = await Company.find({ companyName: { $regex: req.params.companyName, $options: 'i' } }.limit(20));
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rechercher par activité
router.get('/search/activity/:activity', async (req, res) => {
  try {
    const companies = await Company.find({ activity: { $regex: req.params.activity, $options: 'i' } }).limit(20);
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rechercher par adresse
router.get('/search/address/:address', async (req, res) => {
  try {
    const companies = await Company.find({ address: { $regex: req.params.address, $options: 'i' } }).limit(20);
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Récupérer toutes les entreprises
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().limit(20);
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
