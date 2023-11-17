DELIMITER //
CREATE PROCEDURE withdrawal(IN account_nbr INT, IN id_card INT, IN automat_nbr INT, IN w_balance INT)
BEGIN
  DECLARE test1, test2 INT DEFAULT 0;
  DECLARE amount INT;
  DECLARE bal_100, bal_50, bal_20, bal_10 INT DEFAULT 0;
  SET amount=w_balance;
  	IF ((select balance_10 from automat where id_automat = automat_nbr)=0 AND amount%20>0 AND amount>50) THEN 
		SET amount=amount-50;
		SET bal_50=1;
		SET bal_100 = LEAST((SELECT balance_100 from automat where id_automat = automat_nbr), (amount / 100)-0.49);
		SET amount=amount-bal_100*100;
		SET bal_20 = LEAST((SELECT balance_20 from automat where id_automat = automat_nbr), (amount / 20)-0.49);
		SET amount=amount-bal_20*20;
	
	ELSE
  		SET bal_100 = LEAST((SELECT balance_100 from automat where id_automat = automat_nbr), (amount / 100)-0.49);
  		SET amount=amount-bal_100*100;
  		SET bal_50 = LEAST((SELECT balance_50 from automat where id_automat = automat_nbr), (amount / 50)-0.49);
  		SET amount=amount-bal_50*50;
  		SET bal_20 = LEAST((SELECT balance_20 from automat where id_automat = automat_nbr), (amount / 20)-0.49);
  		SET amount=amount-bal_20*20;
  		SET bal_10 = LEAST((SELECT balance_10 from automat where id_automat = automat_nbr), (amount / 10)-0.49);
  		SET amount=amount-bal_10*10;
	END IF;	
	
	IF (amount > 0) THEN
		INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
			VALUES(automat_nbr,account_nbr,id_card,'withdrawal attempt, not enough bills', w_balance, NOW());
	ELSE
		START TRANSACTION;
  		BEGIN
		UPDATE account SET balance = balance - w_balance WHERE id_account = account_nbr AND balance + credit_limit - w_balance >= 0;
		SET test1=ROW_COUNT();
		UPDATE automat SET balance_100=balance_100-bal_100, balance_50=balance_50-bal_50, balance_20=balance_20-bal_20, balance_10=balance_10-bal_10
			WHERE id_automat=automat_nbr;
		SET test2=ROW_COUNT();
    		END;
	
			IF (test1 > 0 AND test2 >0) THEN
				COMMIT;
	  			INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
				VALUES(automat_nbr, account_nbr,id_card,'withdrawal', w_balance, NOW());
			ELSE
	  			ROLLBACK;
	  			INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
					VALUES(automat_nbr, account_nbr,id_card,'withdrawal attempt, not enough', w_balance, NOW());
			END IF;
	END IF;
END //
DELIMITER ;

DELIMITER //
create procedure addAttemptAndLog(IN cardID INT)
begin
UPDATE card SET attempts = attempts+1 WHERE id_card = cardID;
INSERT INTO eventLog(id_automat, id_card, event_type, time) VALUES(1, cardID, "login attempt", NOW());
end //
DELIMITER ;

DELIMITER //
create procedure clearAttemptsAndLog(IN cardID INT)
begin
UPDATE card SET attempts = 0 WHERE id_card = cardID;
INSERT INTO eventLog(id_automat, id_card, event_type, time) VALUES(1, cardID, "login", NOW());
end //
DELIMITER ;
