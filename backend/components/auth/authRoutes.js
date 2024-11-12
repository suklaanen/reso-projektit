const express = require('express');
const router = express.Router();
const AuthService = require('./authService');
const { auth } = require('../middleware/auth');

router.get('/getuserbyid', auth, async (req, res) => {
    const { userid } = req.body;
    try {
        const user = await AuthService.getUser(userid);
        res.status(200).json({ user });
    } catch (error) {
        console.error('Virhe käyttäjän hakemisessa:', error.message);
        res.status(500).json({ message: "Käyttäjän hakemisessa tapahtui virhe" });
    }
});

router.post('/setusername', auth, async (req, res) => {
    const { username } = req.body;
    const result = await AuthService.setUsername(res.locals.userid, username);
    if (result.success) {
        res.status(201).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.post('/register', async (req, res) => {
    const { uid, email } = req.body; 

    try {
        const result = await AuthService.registerUser(uid, email); 
        
        if (result.success) {
            return res.status(201).json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in /register route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleteuser', auth, async (req, res) => {
    const { userid } = res.locals.userid;
    try {
        const result = await AuthService.deleteUser(userid);
        if (result.success) {
            res.status(200).json({ 
                message: result.message,
                accessToken: result.accessToken, 
                refreshToken: result.refreshToken, 
                userid: result.userid, 
                username: result.username });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Virhe käyttäjän poistossa:', error.message);
        res.status(500).json({ message: "Käyttäjän poistossa tapahtui virhe" });
    }
});

module.exports = router;