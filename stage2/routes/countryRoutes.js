import express from 'express';
import { refreshCountries, getCountries, getCountryByName, deleteCountryByName, getStatus, getCountriesImage }  from '../controllers/countryController.js';

const router = express.Router();

router.post('/countries/refresh', refreshCountries);
router.get('/countries', getCountries);
router.get('/countries/image', getCountriesImage);
router.get('/countries/:name', getCountryByName);
router.delete('/countries/:name', deleteCountryByName);
router.get('/status', getStatus);

// Handle missing 'name' paramet for delete
router.delete('/countries', (req, res) => {
  return res.status(400).json({
    error: 'Validation failed',
    details: { name: 'is required' }
  });
});



export default router;