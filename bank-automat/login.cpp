#include "login.h"

Login::Login(QWidget *parent) :
    QWidget(parent)
{
    cardID = "";
    pin = "";
    cardType = "";
    token = "";
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    loginTimer = new QTimer(this);
    loginTimer->setSingleShot(false);
    pin_attempted = false;
}

Login::~Login()
{

}

//Ottaa vastaan kortin ID:n mainwindow:sta
void Login::setCardID(QString inputCardID)
{
    cardID = inputCardID;
    pin_attempted = false;
    requestCardID(); // Kutsutaan metodia, josta lähtee pyyntö REST APIlle kortin tyypin tarkistukselle
}

//Ottaa vastaan PIN koodin mainwindows:sta
void Login::setPIN(QString inputPin)
{
    pin = inputPin;
    requestLogin();// Kutsutaan metodia, josta lähtee login pyyntö REST APIlle
}

//Ottaa vastaan ja käsittelee vastauksen kortin tyypin tarkistuksesta REST APIsta
void Login::handleCard()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastausta

        if(responseData == "false") {
            emit cardFail(); //Tuntematon kortin ID, lähetetään signaali cardFail() maindwindow:lle
        }
        else {
            cardType = QString(responseData).replace("\"", "");
            qDebug() << "cardType:" << cardType;
            if (cardID.toInt() < 1) { //Tarkistetaan, ettei ole annettu tyhjää kortin ID:tä
                emit cardFail(); //Jos ID on tyhjä -> cardFail() maindwindow:lle
            } else {
                checkPinAttempts(); //Jos kortti löytyy, lähdetään tarkistamaan pin koodin yrityskerrat
            }
        }
    } else {
        // Käsitellään mahdollinen virhe vastauksessa (verkkovirhe)
        qDebug() << "Couldnt get card type" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen login pyynnöstä.
void Login::handlePin()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus

        qDebug() << responseData;
        //if(responseData.length()>20) {
        if(responseData != "false") { //Jos vastaus on != "false", niin token on vastaanotettu ja kirjautuminen ok
            token = QString(responseData); //Tallennetaan webtoken myöhempää signaalia varten
            clearPinAttempts(); //Kutsutaan metodia, joka tyhjentää pin koodin yritykerrat kortilta tietokannasta
        }
        else {
            pin_attempted = true;
            addAttempt(); //Jos kirjautuminen epäonnistui, kutsutaan metodia, joka lisää pin koodin yritykerran kortille tietokantaan.
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not login" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen kortin pin koodin yrityskerroista
void Login::handleAttempts()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "3") {
            emit cardLocked(); //Jos kolme yritystä on täynnä niin lähetetään cardLocked() signaali mainwindow:lle
        }
        else {
            if(!pin_attempted) { //Muussa tapauksessa, tarkistetaan onko piniä yritetty tällä käyttökerralla jo vähintään kerran
                if(cardType == "credit/debit") { //Jos piniä ei vielä oltu yritetty ja kyseessä on yhdistelmäkortti
                    emit cardOkSelectType();     //Lähetetään signaali mainwindow:lle, joka aktivoi valitse tyyppi tilan
                }
                else { //Jos kortti on credit, debit tai admin
                    emit cardOk(cardType); //Lähetetään signaali cardOk() mainwindow:lle, jossa siirrytään pin koodin kyselyyn
                }
            }
            else {
                emit loginFail(); //Jos piniä oli jo yritetty kertaalleen, ja korttia ei vielä lukita, lähetetään signaali mainwindow:lle, jossa siirrytään yritä uudestaan tilaan
            }
        }


        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get attempts" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan tiedon onnistuneesta pin koodin yrityskerran lisäämisesta kortille tietokantaan
void Login::handleAddedAttempt()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "true") {
            checkPinAttempts(); //Jos vastaus on odotettu, ja yksi yrityskerta on lisätty kortille, niin lähdetään heti perään tarkistamaan yrityskerrat.
        }

        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not add an attempt" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Ottaa vastaan ja käsittelee vastauksen pin koodin yrityskerojen nollaamisesta
void Login::handleClearAttempts()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "true") { //Jos vastaus on odotettu, ja yritykerrat kortilta on nollattu, niin siirrytään kirjautumisesta eteenpäin
            if (cardType == "admin") { //Tarkistetaan vasta täällä, onko kortin tyyppi admin, koska seuraavat signaalit vievät käyttäjän tai adminin päävalikkoon
                emit loginOkAdmin(token); //Signaali mainwindow:lle adminin päävalikkoon siirtymiseksi
            } else {
                emit loginOkUser(token);  //Signaali käyttäjän päävalikkoon siitymiseksi
            }
        }

        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not clear attempts" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

//Lähettää REST APIin pyynnön kortin tyypin tarkistamiseksi
void Login::requestCardID()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/card/"+cardID));
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleCard()));
}

//Lähettää REST APIin login pyynnön
void Login::requestLogin()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID); //Asetetaan request bodyyn id_card
    body.insert("pin",pin);        //ja pin
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handlePin()));
}

//Lähettää pyynnön REST APIlle pin koodin yritykertojen noutamiseksi
void Login::checkPinAttempts()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAttempts()));
}

//Lähettää pyynnnön REST APIlle pin koodin yrityskertojen nollaamiseksi
void Login::clearPinAttempts()
{
    QNetworkRequest request;
    QJsonObject body;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/clear/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleClearAttempts()));
}

//Lähettää pyynnön lisätä yksi yrityskerta kortille tietokantaan
void Login::addAttempt()
{
    QNetworkRequest request;
    QJsonObject body;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleAddedAttempt()));
}


