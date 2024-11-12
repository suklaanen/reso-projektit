const express = require('express');
const router = express.Router();
const ItemsService = require('./itemService');
const { auth } = require('../middleware/auth');

router.get('/getitems', auth, async (req, res) => {
    try {
        const items = await ItemsService.getItems();
        res.status(200).json({ items: items });
    } catch (error) {
        console.error('Error in /getitems route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getitembyid', auth, async (req, res) => {
    const { itemId } = req.body;
    try {
        const item = await ItemsService.getItemById(itemId);
        res.status(200).json({ item: item });
    } catch (error) {
        console.error('Error in /getitembyid route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/additem', auth, async (req, res) => {
    const { itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse } = req.body;
    try {
        const item = await ItemsService.addItem(itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse);
        res.status(201).json({ item: item });
    } catch (error) {
        console.error('Error in /additem route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleteitem', auth, async (req, res) => {
    const { itemId } = req.body;
    try {
        const item = await ItemsService.deleteItem(itemId);
        res.status(200).json({ item: item });
    } catch (error) {
        console.error('Error in /deleteitem route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/updateitem', auth, async (req, res) => {
    const { itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse } = req.body;
    try {
        const item = await ItemsService.updateItem(itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse);
        res.status(200).json({ item: item });
    } catch (error) {
        console.error('Error in /updateitem route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;