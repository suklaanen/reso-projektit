require('dotenv').config();
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    console.error('Ympäristömuuttujat eivät ole asetettu oikein!');
    process.exit(1); 
}

function createAccessToken(user) {
    return jwt.sign(
        { userid: user.id, username: user.username, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function createRefreshToken(user) {
    return jwt.sign(
        { userid: user.id, username: user.username, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '3y' }
    );
}

function decodeToken(token, isRefreshToken = false) {
    const secret = isRefreshToken ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
}

function refreshToken(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Refresh token vaaditaan' });
    }

    try {
        const decoded = decodeToken(token, true);
        const newAccessToken = createAccessToken({ id: decoded.userid, username: decoded.username });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Virhe refresh tokenin tarkastuksessa:', error);
        return res.status(403).json({ message: 'Virheellinen refresh token' });
    }
}

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];        

    if (!token) {
        return res.status(401).json({ message: 'Token vaaditaan' });
    }

    try {
        const { userid, username } = decodeToken(token);
        res.locals.userid = userid;
        res.locals.username = username;
        next();
    } catch (error) {
        console.error('Virhe tokenin tarkastuksessa:', error);
        return res.status(403).json({ message: 'Virheellinen token' });
    }
}

module.exports = { createAccessToken, createRefreshToken, decodeToken, refreshToken, auth };
