-- Käyttäjätiedot
INSERT INTO users (firebaseuserid, username, usermail) VALUES
('0WjvcjUmQ4Xh3kZjI6aFsmvJC2h2', 'Siilinpieru', 'kakkare@kakka.fi'),
('yzkbu3AU4dWI6t1ciZ8e5GJNHLu2', 'maitotee', 'kakka@kakka.fi'),
('JAttIJDFtNMXNQN5oBas6WkJFhg2', 'PaijaanSUA', 'teppo@mail.net'),
('Iz1NMQyy8zawJNrKbJzBA792Txk1', 'Jenna', 'nappi@nappi.fi'),
('OMhagDA6eVgpok70Z2ywj39yAMz1', 'Kan-Joni', 'rusina@munkki.net');

-- Insert test items
INSERT INTO items (giverid, itemname, itemdescription, itempicture, queretruepickfalse, postalcode, city) VALUES 
(1, 'Hamsu -kirja', 'Käytetyssä kunnossa, kirja hamsterin hoidosta', 'book.jpg', TRUE, '00100', 'Helsinki'),
(2, 'Tuolit 6kpl', 'Keittiön pöydät, 6kpl, pinta rispaantunut muutamassa, muuten hyvä kunto!', 'chair.jpg', FALSE, '00200', 'Espoo'),
(3, 'Työpöytä', 'Pienikokoinen työpöytä, koko 60x100 cm, tästä vaikka etätyöskentelyyn. Näppärä, ei keiku', 'table.jpg', TRUE, '00300', 'Tampere');

-- Insert takers
INSERT INTO takers (userid, itemid, description) VALUES 
(2, 1, 'Voisin hakea vaikka heti tänään, klo 19 jälkeen illalla!'),
(3, 1, 'Tyttärelle voisin tämän hakea. Käykö haku huomenna?'),
(1, 3, 'Kiinnostunut työpöydästä, haku koska vaan');

-- Insert threads
INSERT INTO threads (itemid, takerid, created_at) VALUES 
(1, 2, CURRENT_TIMESTAMP),
(2, 3, CURRENT_TIMESTAMP),
(3, 1, CURRENT_TIMESTAMP);

-- Insert messages
INSERT INTO messages (threadid, senderid, message, created_at) VALUES 
(1, 1, 'Message from giver to Alice', CURRENT_TIMESTAMP),
(2, 3, 'Message from taker Charlie', CURRENT_TIMESTAMP),
(3, 2, 'Question from Bob', CURRENT_TIMESTAMP);