const express = require('express');
const router = express.Router();
const AuthService = require('./authService');
const { refreshToken, auth } = require('../middleware/auth');

router.post('/refresh-token', refreshToken);

router.get('/protected-route', auth, (req, res) => {
    res.json({ message: 'Protected data' });
});

router.get('/username/:username', auth, async (req, res) => {
    const userId = res.locals.userid;
    const user = await AuthService.getUserById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});
 
router.get('/email/:email', auth, async (req, res) => {
    const user = await AuthService.getUserByEmail(req.params.email); 

    if (!user) return res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
    res.status(200).json(user);
});

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await AuthService.createUser(username, email, password);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Virhe luotaessa käyttäjää.', error });
    }
});

router.put('/:userid/password', auth, async (req, res) => {
    const { userid } = req.params;
    const { newPassword } = req.body;
    const authUserId = res.locals.userid; 
    
    if (userid !== authUserId) {
        return res.status(403).json({ message: 'Et voi päivittää toisen käyttäjän salasanaa.' });
    }

    try {
        const updatedUser = await AuthService.updatePassword(userid, newPassword);
        if (updatedUser) {
            res.status(200).json({ message: 'Salasana päivitetty onnistuneesti.' });
        } else {
            res.status(404).json({ message: 'Käyttäjää ei löytynyt.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Virhe päivittäessä salasanaa.', error });
    }
});

router.post('/try/register', async (req, res) => {
    const { username, password, email } = req.body;
    const result = await AuthService.registerUser(username, password, email);
    if (result.success) {
        res.status(201).json({ message: result.message });
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.post('/try/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await AuthService.loginUser(username, password);
    if (result.success) {
        res.status(200).json({ 
            success: true, 
            message: result.message, 
            accessToken: result.accessToken, 
            refreshToken: result.refreshToken, 
            userid: result.userid, 
            username: result.username
        });
    } else {
        res.status(400).json({ message: result.message });
    }
});

router.post('/try/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await AuthService.forgotPassword(email);
        if (result.success) {
            res.status(200).json({ message: "Salasanan vaihto onnistui" });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Virhe salasanan vaihdossa:', error.message);
        res.status(500).json({ message: "Salasanan vaihdossa tapahtui virhe" });
    }
});

router.delete('/try/delete-user', async (req, res) => {
    const { userid } = req.body;
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
