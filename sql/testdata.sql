use bank_automat;

--
-- Insert test data into tables 
--

ALTER TABLE  `user` AUTO_INCREMENT = 1;
INSERT INTO `user` (`firstname`, `lastname`, `address`, `city`) 
VALUES 
('Sofia','Virtanen','Ruusukatu 12','Helsinki'),
('Markus','Mustonen','Tammentie 34','Tampere'),
('Anni','Koivisto','Kuuselantie 7','Turku'),
('Mikko','Laaksonen','Kalliotie 21','Oulu'),
('Simo','Järvinen','Mäntyläntie 3','Jyväskylä'),
('Laura','Järvinen','Mäntyläntie 3','Jyväskylä'),
('Juha','Ranta','Merenranta 9','Vaasa'),
('Elina','Koskinen','Koiranta 3','Rovaniemi'),
('Tapani','Matalamäki','Pielitie 4','Helsinki'),
('Juuso','Neulanen','Sorvarannankatu 1','Espoo'),
('Miki','Kolttinen','Tietokatu 42','Janakkala'),
('Emilia','Metso','Isokiesinkuja 3','Porvoo'),
('Risto','Rievä','Kuiluntie 3','Espoo'),
('Jonna-Maria','Älyhoikko','Sirppitie 8','Kotka'),
('Eevertti','Teurasvaara','Helakatu 10','Loviisa'),
('Esko','Isotuuli','Pinojoenreuna 2','Turku'),
('Lauriina','Halkonen','Lepokatu 2','Vaasa'),
('Paavo','Tietty','Pankkiirintie 15','Pirkkala'),
('Mauri','Ala-Vesko','Sieväkatu 9','Tampere'),
('Tiina','Tärskynen','Pikkuhiirunkuja 2','Kangasala'),
('RFAT','RFAT','RFAT','RFAT');

ALTER TABLE  `account` AUTO_INCREMENT = 1;
INSERT INTO `account` (`account_nmbr`, `bank_name`, `account_type`, `balance`, `max_withdrawal_per_day`, `credit_limit`) 
VALUES
('FI6757406151000966','OP','debit',337460.00,1500,0.00),
('FI4518512110001009','Nordea','debit',575.00,900,0.00),
('FI4356350869000747','OP','credit',0.00,400,8000.00),
('FI8124472240001985','Nordea','credit',0.00,500,4000.00),
('FI0888221250006035','Danske','debit',2443.00,800,0.00),
('FI9557008180000601','OP','debit',136700.00,900,0.00),
('FI2047826257000011','POP','credit',0.00,100,1000.00),
('FI1924662630002698','Nordea','credit',0.00,300,1000.00),
('FI2085184780009213','Danske','debit',486.00,500,0.00),
('FI8151109395000935','OP','credit',0.00,400,1000.00),
('FI8247876568000341','POP','debit',648.00,200,0.00),
('FI6864368220006138','Ålandsbanken','debit',58.00,500,0.00),
('FI0431470740000938','Handelsbanken','credit',0.00,400,2000.00),
('FI9688806580005721','Danske','debit',1287.00,600,0.00),
('FI9334879810009677','Danske','debit',10600.52,150,0.00),
('FI8347735554000063','Danske','debit',26.75,400,0.00),
('FI5734526830003939','Danske','credit',0.00,1000,5000.00),
('FI2986096610007853','Danske','debit',13.00,1200,0.00),
('FI9639417620006834','S-Pankki','debit',27654.28,500,0.00),
('FI4558506014000738','OP','debit',245.78,200,0.00),
('FI7936819450006748','S-Pankki','debit',6709.23,900,0.00),
('FI1739670770007438','S-Pankki','credit',0.00,400,7500.00),
('FI9347825117000377','S-Pankki','credit',0.00,500,2000.00),
('FI2540531573000508','Aktia Pankki','debit',45501.89,800,0.00),
('FI8939336190007453','S-Pankki','debit',765.12,900,0.00),
('FI8814044420008171','Nordea','credit',0.00,100,4500.00),
('FI5436267120007813','S-Pankki','credit',0.00,300,5000.00),
('FI0652695467000349','OP','debit',8765.43,500,0.00),
('FI4634734620007488','Danske','debit',1098.76,400,0.00),
('FI5371354040002664','Citibank','debit',5432.1,200,0.00),
('FI7434884180001833','Danske','debit',9876.54,500,0.00),
('FI5136646110005921','S-Pankki','debit',3210.98,400,0.00),
('FI0931444250001479','Handelsbanken','credit',0.00,600,5500.00),
('FI2817508830004274','Nordea','credit',0.00,200,2500.00),
('FI2058147944000215','OP','debit',210.34,200,0.00),
('FI4617868230001217','Nordea','debit',876.98,900,0.00),
('FI0241037528000162','Säästöpankki','credit',0.00,400,8000.00),
('FI9436341760008637','S-Pankki','credit',0.00,500,1500.00),
('FI1240527740000249','Aktia','debit',2345.67,800,0.00),
('FI3836856950000003','S-Pankki','credit',0.00,900,6500.00),
('FI6468109990001107','Ålandsbanken','debit',543.21,1000,0.00),
('FI4856071711000053','OP','debit',789.12,300,0.00),
('FI2631211790006155','Handelsbanken','credit',0.00,500,3000.00),
('FI0842127633000899','Säästöpankki','debit',8765.21,400,0.00),
('FI2034651590004701','Danske','debit',1098.43,200,0.00),
('FI8436757750000666','S-Pankki','debit',65423.87,500,0.00),
('FI4287175370001857','Danske','credit',0.00,400,9000.00),
('FI4582799790005969','Danske','debit',4321.09,600,0.00),
('FI5268695660000882','Ålandsbanken','debit',5678.90,1500,0.00),
('ROBOTFW','AUTOMATION TESTING','admin',0.00,0,0.00);

SELECT id_user FROM user;

ALTER TABLE  `card` AUTO_INCREMENT = 1;
INSERT INTO `card` (`type`, `pin`, `id_user`, `attempts`) 
VALUES
('debit','$2a$10$aN/zewaV8CL3jYQE0I/LA.P0IZVMUBm7WKaB9x30zNCc2GtBgJYI6',1,0),
('debit','$2a$10$.sd7wgEvDqYVovZGCekutOJWmuT/UbSkKnziiHJ/PEHjLNpcGvT/2',2,0),
('credit','$2a$10$SeSnzNgfIHcRN762pVzP.eTxHAZ54PUTJU9/Oe4nbwgXpr9L2A1tW',3,0),
('debit','$2a$10$L98HWiHh.p6fc7uPQ2tOfu9lfnAjseztEqHnNZNBuk7wBOX0Ij12K',4,0),
('debit','$2a$10$7Hl048Rp2TMEddzMB9qETuoTFQ.5uneik2pM0086kIG1s7wifP06m',5,0),
('debit','$2a$10$GOgKGbGAvblTl22mQxKqgeUzPB0MUghbKjxSH8vVoZGnFPl4/344C',6,0),
('debit','$2a$10$8bklPdiOMp.BCBSn6lNg9O3UTYVno.5ExTcUDulwkjw10YdvdhIWa',7,0),
('debit','$2a$10$ro6qAViOdugq04jedNuq8upRjurImj7gaFnGQuhd/5kGMRv6CCmmW',8,0),
('admin','$2a$10$5sceyVyziaaxRoG8zBcY8eSlJP04QF.8DN5R8Nid0WDCi6JD2ewwO',1,0),
('credit','$2a$10$djftLN657IIIug90A8vDde.ZSlkZpUt6bIUbbql8.UOgq2GqT1GCK',9,0),
('debit','$2a$10$Teau3aLIyl9Dy08zn2zzSONUDwLxGP22XwC2zyH6qaeUpNP/V8Ef2',4,0),
('debit','$2a$10$L2NjIxmvQucEX9RrkriBwOSURd0ITBV8XXfodVqEDccWU6ibNhS7y',5,0),
('debit','$2a$10$dmjQcu7P/rwChhhl.56foelwJsPXs3cAfgmKGYcqIoqQ4LNOwsuta',10,0),
('debit','$2a$10$D9MmIjAh7/DXQXqFkYsVb.HYqTCyV382a9yBYnI50Cuxe4SziIIpu',14,0),
('debit','$2a$10$u32TnvdQIETlYkgTZzMwQuHxZCDWcmSPGMmgF6XR1uJjMxhvwxoM6',15,0),
('credit/debit','$2a$10$XWrBB4kQnUFZId6iwm7IQu1YypE8HoIlIjxiCUjjeTwQOJDCzgegC',13,0),
('debit','$2a$10$VU4azfFqhbugRWZOwC0XwOkT5JV/WmC030O5ZEpc08YF0Z3jN4ar.',11,0),
('debit','$2a$10$NnQbWtK0rEsdtyShz/plGeGc/bC8M2WBFVRnWVdJt.iDb.BCM6Rq6',17,0),
('debit','$2a$10$6Bn88h6C4vGFsseK7XycFu.BGLg6PqelNWc.ZexptgTUxYiqvwTTu',19,0),
('admin','$2a$10$R7fw5jpjUmQfv0bbF8cbH.syU//LfWu7PchSvX/6Dya8nMOYIIhNO',20,0);

# esim. käyttäjällä 19 on nyt kortti (16) kahteen tiliin (30) debit (33) credit
# esim. käyttäjällä 2 ja 3 on yhteinen tili (2) debit
# esim. käyttäjällä 4 ja 5 on yhteinen tili (5) debit
# esim. käyttäjillä 7 ja 11 admin  oikeudet 
ALTER TABLE  `accountuser` AUTO_INCREMENT = 1;
INSERT INTO `accountuser` (`id_user`, `id_card`, `id_account`) 
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(8, 4, 3),
(6, 5, 4),
(4, 6, 5),
(5, 7, 5),
(5, 8, 6),
(7, 9, NULL),
(9, 10, 7),
(10, 17, 8),
(11, 20, NULL),
(19, 16, 30),
(19, 16, 33),
(20, 20, 50);

ALTER TABLE  `automat` AUTO_INCREMENT = 1;
INSERT INTO `automat` (`balance_10`, `balance_20`, `balance_50`, `balance_100`, `max_withdrawal`) 
VALUES
(45, 14, 21, 0, 500),
(60, 76, 79, 2, 500),
(70, 90, 55, 50, 500),
(110, 100, 82, 39, 500);

INSERT INTO `eventlog` (`id_automat`, `id_account`, `id_card`, `event_type`, `amount`, `time`) 
VALUES 
(1, 50, 20, 'Test Event', 0, NOW());
