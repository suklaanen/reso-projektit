const cron = require('node-cron');
const pool = require('./database/db_connection');
//const messageService = require('./messages/messageService');

// voi cronitaskittaa kaikki ilmoitukset (items) ja poistaa ne, jotka ovat vanhentuneet
// sekä viestiketjut (messages), jotka ovat vanhentuneet 

// example. every 12 hours
//cron.schedule('0 */12 * * *', async () => {
//    try {
//        await messageService.removeExpiredChatsService();
//        console.log('Vanhoja chatteja poistettu, jos niitä oli.');
//    } catch (error) {
//        console.error('Virhe vanhentuneiden tietojen poistamisessa', error);
//    }
//});
