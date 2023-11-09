use bank_automat;

--
-- Insert test data into tables 
--

# /id_user /firstname /lastname /address /city
INSERT INTO `user` VALUES 
(1,'Sofia','Virtanen','Ruusukatu 12','Helsinki'),
(2,'Markus','Mustonen','Tammentie 34','Tampere'),
(3,'Anni','Koivisto','Kuuselantie 7','Turku'),
(4,'Mikko','Laaksonen','Kalliotie 21','Oulu'),
(5,'Simo','Järvinen','Mäntyläntie 3','Jyväskylä'),
(6,'Laura','Järvinen','Mäntyläntie 3','Jyväskylä'),
(7,'Juha','Ranta','Merenranta 9','Vaasa'),
(8,'Elina','Koskinen','Koiranta 3','Rovaniemi'),
(9,'Tapani','Matalamäki','Pielitie 4','Helsinki'),
(10,'Juuso','Neulanen','Sorvarannankatu 1','Espoo'),
(11,'Miki','Kolttinen','Tietokatu 42','Janakkala'),
(12,'Emilia','Metso','Isokiesinkuja 3','Porvoo'),
(13,'Risto','Rievä','Kuiluntie 3','Espoo'),
(14,'Jonna-Maria','Älyhoikko','Sirppitie 8','Kotka'),
(15,'Eevertti','Teurasvaara','Helakatu 10','Loviisa'),
(16,'Esko','Isotuuli','Pinojoenreuna 2','Turku'),
(17,'Lauriina','Halkonen','Lepokatu 2','Vaasa'),
(18,'Paavo','Tietty','Pankkiirintie 15','Pirkkala'),
(19,'Mauri','Ala-Vesko','Sieväkatu 9','Tampere'),
(20,'Tiina','Tärskynen','Pikkuhiirunkuja 2','Kangasala');

# /id_card /type (enum) /pin /id_user /attempts
INSERT INTO `card` VALUES
(1,'debit',6371,1,0),
(2,'debit',6223,2,0),
(3,'credit',2163,3,0),
(4,'debit',7997,4,0),
(5,'debit',3261,5,0),
(6,'debit',1038,6,0),
(7,'debit',9121,7,0),
(8,'debit',4576,8,0),
(9,'admin',1234,1,0),
(10,'credit',4512,9,0),
(11,'debit',5544,4,0),
(12,'debit',5843,5,0),
(13,'debit',3423,10,0),
(14,'debit',0981,14,0),
(15,'debit',4352,15,0),
(16,'credit/debit',1165,13,0),
(17,'debit',4431,11,0),
(18,'debit',7575,17,0),
(19,'debit',8019,19,0),
(20,'admin',0914,20,0);

# /id_account /account_nmbr /bank_name /account_type / balance /max_withdrawal_per_day /credit_limit
INSERT INTO `account` VALUES
(1,'FI6757406151000966','OP','debit',337460.00,1500,0.00),
(2,'FI4518512110001009','Nordea','debit',575.00,900,0.00),
(3,'FI4356350869000747','OP','credit',0.00,400,8000.00),
(4,'FI8124472240001985','Nordea','credit',0.00,500,4000.00),
(5,'FI0888221250006035','Danske','debit',2443.00,800,0.00),
(6,'FI9557008180000601','OP','debit',136700.00,900,0.00),
(7,'FI2047826257000011','POP','credit',0.00,100,1000.00),
(8,'FI1924662630002698','Nordea','credit',0.00,300,1000.00),
(9,'FI2085184780009213','Danske','debit',486.00,500,0.00),
(10,'FI8151109395000935','OP','credit',0.00,400,1000.00),
(11,'FI8247876568000341','POP','debit',648.00,200,0.00),
(12,'FI6864368220006138','Ålandsbanken','debit',58.00,500,0.00),
(13,'FI0431470740000938','Handelsbanken','credit',0.00,400,2000.00),
(14,'FI9688806580005721','Danske','debit',1287.00,600,0.00),
(15,'FI9334879810009677','Danske','debit',10600.52,150,0.00),
(16,'FI8347735554000063','Danske','debit',26.75,400,0.00),
(17,'FI5734526830003939','Danske','credit',0.00,1000,5000.00),
(18,'FI2986096610007853','Danske','debit',13.00,1200,0.00),
(19,'FI9639417620006834','S-Pankki','debit',27654.28,500,0.00),
(20,'FI4558506014000738','OP','debit',245.78,200,0.00),
(21,'FI7936819450006748','S-Pankki','debit',6709.23,900,0.00),
(22,'FI1739670770007438','S-Pankki','credit',0.00,400,7500.00),
(23,'FI9347825117000377','S-Pankki','credit',0.00,500,2000.00),
(24,'FI2540531573000508','Aktia Pankki','debit',45501.89,800,0.00),
(25,'FI8939336190007453','S-Pankki','debit',765.12,900,0.00),
(26,'FI8814044420008171','Nordea','credit',0.00,100,4500.00),
(27,'FI5436267120007813','S-Pankki','credit',0.00,300,5000.00),
(28,'FI0652695467000349','OP','debit',8765.43,500,0.00),
(29,'FI4634734620007488','Danske','debit',1098.76,400,0.00),
(30,'FI5371354040002664','Citibank','debit',5432.1,200,0.00),
(31,'FI7434884180001833','Danske','debit',9876.54,500,0.00),
(32,'FI5136646110005921','S-Pankki','debit',3210.98,400,0.00),
(33,'FI0931444250001479','Handelsbanken','credit',0.00,600,5500.00),
(34,'FI2817508830004274','Nordea','credit',0.00,200,2500.00),
(35,'FI2058147944000215','OP','debit',210.34,200,0.00),
(36,'FI4617868230001217','Nordea','debit',876.98,900,0.00),
(37,'FI0241037528000162','Säästöpankki','credit',0.00,400,8000.00),
(38,'FI9436341760008637','S-Pankki','credit',0.00,500,1500.00),
(39,'FI1240527740000249','Aktia','debit',2345.67,800,0.00),
(40,'FI3836856950000003','S-Pankki','credit',0.00,900,6500.00),
(41,'FI6468109990001107','Ålandsbanken','debit',543.21,1000,0.00),
(42,'FI4856071711000053','OP','debit',789.12,300,0.00),
(43,'FI2631211790006155','Handelsbanken','credit',0.00,500,3000.00),
(44,'FI0842127633000899','Säästöpankki','debit',8765.21,400,0.00),
(45,'FI2034651590004701','Danske','debit',1098.43,200,0.00),
(46,'FI8436757750000666','S-Pankki','debit',65423.87,500,0.00),
(47,'FI4287175370001857','Danske','credit',0.00,400,9000.00),
(48,'FI4582799790005969','Danske','debit',4321.09,600,0.00),
(49,'FI5268695660000882','Ålandsbanken','debit',5678.90,1500,0.00);

# /id_accountUser /id_user /id_card /id_account
# esim. käyttäjällä 19 on nyt kortti (16) kahteen tiliin (30) debit (33) credit
# esim. käyttäjällä 2 ja 3 on yhteinen tili (2) debit
# esim. käyttäjällä 4 ja 5 on yhteinen tili (5) debit
# esim. käyttäjillä 7 ja 11 admin  oikeudet 
INSERT INTO `accountuser` VALUES
(1,1,1,1),
(2,2,2,2),
(3,3,3,2),
(4,8,4,3),
(5,6,5,4),
(6,4,6,5),
(7,5,7,5),
(8,5,8,6),
(9,7,9,NULL),
(10,9,10,7),
(11,10,17,8),
(12,11,20,NULL),
(13,19,16,30), 
(14,19,16,33); 

# /id_event /id_automat /id_account /id_card /event_type /amount /time
#INSERT INTO `eventlog` VALUES
# NOTHING YET

# /id_automat /balance_10 /balance_20 /balance_50 /balance_100 /max_withdrawal
INSERT INTO `automat` VALUES
(1,45,14,21,0,500),
(2,60,76,79,2,500),
(3,70,90,55,50,500),
(4,110,100,82,39,500);

