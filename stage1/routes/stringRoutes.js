import express from 'express';
import {
    createString,
    getStringByValue,
    deleteStringByValue,
    getFilteredStrings,
    filterByNaturalLanguage
} from '../controllers/stringController.js';

const router  = express.Router();

router.post('/strings', createString);
router.get('/strings/filter-by-natural-language', filterByNaturalLanguage);
router.get('/strings', getFilteredStrings)
router.delete('/strings/:value', deleteStringByValue);
router.get('/strings/:value', getStringByValue);

export default router;
