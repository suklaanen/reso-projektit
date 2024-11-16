-- Schema for the Postgres database

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS takers CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS threads CASCADE;


CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    firebaseuserid VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) UNIQUE,
    usermail VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE items (
    itemid SERIAL PRIMARY KEY,
    giverid INT REFERENCES users(userid) ON DELETE CASCADE,
    itemname VARCHAR(255) NOT NULL,
    itemdescription TEXT,
    itempicture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    queuetruepickfalse BOOLEAN NOT NULL DEFAULT TRUE,
    expiration_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 week'),
    postalcode VARCHAR(20),
    city VARCHAR(255)
);

CREATE TABLE takers (
    takerid SERIAL PRIMARY KEY,
    userid INT REFERENCES users(userid) ON DELETE CASCADE,
    itemid INT REFERENCES items(itemid) ON DELETE CASCADE,
    description TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threads (
    threadid SERIAL PRIMARY KEY,
    itemid INT REFERENCES items(itemid) ON DELETE CASCADE,
    takerid INT REFERENCES takers(takerid) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 day')
);

CREATE TABLE messages (
    messageid SERIAL PRIMARY KEY,
    threadid INT REFERENCES threads(threadid) ON DELETE CASCADE,
    senderid INT REFERENCES users(userid) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION check_description()
RETURNS TRIGGER AS $$
BEGIN
    -- Tarkistetaan, onko itemin queuetruepickfalse TRUE
    IF (SELECT queuetruepickfalse FROM items WHERE itemid = NEW.itemid) = FALSE THEN
        -- Jos queuetruepickfalse on FALSE, description ei saa olla NULL
        IF NEW.description IS NULL THEN
            RAISE EXCEPTION 'Description cannot be NULL when queuetruepickfalse is FALSE';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


ALTER SEQUENCE users_userid_seq RESTART WITH 1;
ALTER SEQUENCE takers_takerid_seq RESTART WITH 1;
ALTER SEQUENCE items_itemid_seq RESTART WITH 1;
ALTER SEQUENCE messages_messageid_seq RESTART WITH 1;
ALTER SEQUENCE threads_threadid_seq RESTART WITH 1;