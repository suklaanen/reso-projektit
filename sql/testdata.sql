-- Käyttäjätiedot
INSERT INTO users (username, hashedpassword, usermail) 
VALUES
    ('Viilipytty', '$2b$10$Tln3kY..bdJs6m7EMnw.HOqMKuCGPX1yDybMc0VBJr1cU4aO/nKp6', 'testi1@testi.fi'),
    ('Jankka', '$2b$10$vetRYrr4RKoEZEs25cFP0eBmVPsWz3URNiV1RcL0u994zpLdJvT8e', 'testi2@testi.fi'),
    ('komediaa82', '$2b$10$OfxbGup1T5xphfS2liR4x.x10/v7TZcisOZwoJ7cNS23ynENGxk6q', 'testi3@testi.fi'),
    ('Eloton', '$2b$10$WwXYsv7eUPctohMogFqVA.29E8YBzQnl2LqYpwAJWGX5YMwOfkaum', 'testi4@testi.fi'),
    ('vainse', '$2b$10$Xm14vC0eLcqBGreZT3aMYuAZ0CuMz21mY2bPFzSmfrjw01RClBrAq', 'testi5@testi.fi'),
    ('jokaToka', '$2b$10$5hIswI9hDMggjLRcEk6ex.vdQI130Vip6F5Muz5bsG5ddf4P16a0.', 'testi6@testi.fi'),
    ('Mikk0', '$2b$10$h0swUPrdtaMqmmQsLSD1/ePlPpKkjMren24LZ5Gr1OQ9kQtmBaMYy', 'testi7@testi.fi'),
    ('dramaqueen', '$2b$10$Js9l0jWZrV6vMF1kVwIJ4eAqwux3QKiw3qWzypWF/m4IMYG52LsEG', 'testi8@testi.fi'),
    ('kauhistus', '$2b$10$xB0DcqbMGpwkRyt5H1Mok.Hplx5Kw7kkbIqIMqKip9EOLid4BsYye', 'testi9@testi.fi'),
    ('Jest4s', '$2b$10$L0Cs3pvdHmABZ8pfjBG2E.L10/BZWa.Jf1TzxYvHLZZqP1K/4xQCO', 'testi10@testi.fi'),
    ('AaveMaria', '$2b$10$Oy2hg/GimhHJkOEDJYq5bOfNmhoYf44zIlHpf355EomSZTW/espvC', 'testi11@testi.fi'),
    ('siippa5', '$2b$10$SGlUYyLYG0ldqMwfksPzy.lubAQB8dvs/j.8KOowum2aY6Xsj159S', 'testi12@testi.fi'),
    ('Pastilli', '$2b$10$zyKsLiLu7MmMrpId7jme4OrX4Vf2NN9HIlmQBIIwacgw45sFKI/0O', 'testi13@testi.fi'),
    ('Huutista', '$2b$10$7Q0PT0vTbiJ9j45SgfWB6uWUaegrWF0UcQ..lLwkOEJfpqt0G4rgy', 'testi14@testi.fi'),
    ('salaakaton', '$2b$10$boxY9HPyt7tbDE1/vF/s5Of7m2VfocyT858CmMaiGvkYwkGzIPj/y', 'testi15@testi.fi'),
    ('Kan-Joni', '$2b$10$NRl7gRaJJIJuft/htMnwmuh240Cw5TWKwnQkbIlVy9LVarwmqx0Dm', 'testi16@testi.fi'),
    ('poikamies', '$2b$10$4SlmY7FqqJ8JSjgXMoJS/ObvQVNpvW9sCuucl17PkyebgEs2thPdy', 'testi17@testi.fi'),
    ('Misu01', '$2b$10$wwRp5IyQflI.w6b9W0geoevH7KTezoG7klgoTJQa2I70yni0VG16S', 'testi18@testi.fi'),
    ('maitotee', '$2b$10$D8v4tg06DzmwplfqZfkSLO7K5vCq7UdUR4Q5P2yM/3/kCCuSmokr6', 'testi19@testi.fi'),
    ('lipettiin', '$2b$10$.I0msVJF2DI58Fv5hsTNKezOZ5llqoipeySpqOZSBHRrdkJCvUm8u', 'testi20@testi.fi'),
    ('Jenna', '$2b$10$HEj21TeJgSDXUJTXpW56butNdEYS2jTZ9lN2CiXxD1oi357t0gGFW', 'testi21@testi.fi'),
    ('Siilinpieru', '$2b$10$JVCPbexn1FSTfFkVRldWteXGVX9gEX1If2rxBIe3PtK0gTIBCDaka', 'testi22@testi.fi'),
    ('PaijaanSUA', '$2b$10$md0gzGB7Usg9/9FhOqTDC.DgsW2GwLBzoSJd9szr3iHY3J7yvFWFO', 'testi23@testi.fi');

-- Insert test items
INSERT INTO items (giverid, itemname, itemdescription, itempicture, queretruepickfalse, postalcode, city) VALUES 
(1, 'Book', 'A used book', 'book.jpg', TRUE, '00100', 'Helsinki'),
(2, 'Chair', 'Wooden chair', 'chair.jpg', FALSE, '00200', 'Espoo'),
(3, 'Table', 'Small table', 'table.jpg', TRUE, '00300', 'Tampere');

-- Insert takers
INSERT INTO takers (userid, itemid, description) VALUES 
(2, 1, 'Interested in reading'),
(3, 2, 'Looking for furniture'),
(1, 3, 'Table for crafting');

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