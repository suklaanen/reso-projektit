-- Käyttäjätiedot
INSERT INTO users (firebaseuserid, username, usermail) VALUES
('0WjvcjUmQ4Xh3kZjI6aFsmvJC2h2', 'Siilinpieru', 'kakkare@kakka.fi'),
('yzkbu3AU4dWI6t1ciZ8e5GJNHLu2', 'maitotee', 'kakka@kakka.fi'),
('JAttIJDFtNMXNQN5oBas6WkJFhg2', 'PaijaanSUA', 'teppo@mail.net'),
('Iz1NMQyy8zawJNrKbJzBA792Txk1', 'Jenna', 'nappi@nappi.fi'),
('OMhagDA6eVgpok70Z2ywj39yAMz1', 'Kan-Joni', 'rusina@munkki.net');

-- Lisää esineitä (items), jotka on liitetty antajiin (giverid viittaa users.userid)
INSERT INTO items (giverid, itemname, itemdescription, itempicture, postalcode, city)
VALUES 
    (1, 'Bicycle', 'A good mountain bike.', 'bicycle.jpg', '00100', 'Helsinki'),
    (3, 'Laptop', 'A working laptop with some scratches.', 'laptop.jpg', '02100', 'Espoo'),
    (1, 'Books', 'A collection of mystery novels.', 'books.jpg', '00100', 'Helsinki');

-- Lisää ottajia (takers), jotka ovat kiinnostuneita esineistä
INSERT INTO takers (userid, itemid, description)
VALUES 
    (2, 1, 'Interested in the bike for daily commute.'),
    (4, 2, 'Looking for a laptop for schoolwork.');

-- Lisää keskusteluketjuja (threads) ottajien ja esineiden välille
INSERT INTO threads (itemid, takerid)
VALUES 
    (1, 1),
    (2, 2);

-- Lisää viestejä (messages) keskusteluketjuihin
INSERT INTO messages (threadid, senderid, message)
VALUES 
    (1, 1, 'Hi, I am interested in your bike. Is it still available?'),
    (1, 2, 'Yes, it is. Can you pick it up tomorrow?'),
    (2, 3, 'Hello, I need the laptop urgently.'),
    (2, 4, 'Sure, let us discuss the details.');