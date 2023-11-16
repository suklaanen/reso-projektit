#include "login.h"

Login::Login(QWidget *parent) :
    QWidget(parent)
{
    cardID = "";
    pin = "";
    cardType = "";
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
                checkPinAttempts();
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
            if (cardType == "admin") { //Tarkistetaan vasta täällä, onko kortin tyyppi admin, koska seuraavat signaalit vievät käyttäjän tai adminin päävalikkoon
                emit loginOkAdmin(QString(responseData)); //Lähetetään mainwindow:lle signaali adminin päävalikkoon siirtymiseksi
            } else {
                emit loginOkUser(QString(responseData));  //Signaali käyttäjän päävalikkoon siityminen
            }
        }
        else {
            pin_attempted = true;
            addAttempt();
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not login" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void Login::handleAttempts()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "3") {
            emit cardLocked();
        }
        else {
            if(!pin_attempted) {
                if(cardType == "credit/debit") {
                    emit cardOkSelectType();
                }
                else {
                    emit cardOk(cardType);
                }
            }
            else {
                emit loginFail();
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

void Login::handleAddedAttempt()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData == "true") {
            checkPinAttempts();
        }

        qDebug() << responseData;

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get attempts" << reply->errorString();
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

void Login::checkPinAttempts()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAttempts()));
}

void Login::addAttempt()
{
    QNetworkRequest request;
    QJsonObject body;
    request.setUrl(QUrl("http://localhost:3000/cardAttempts/"+cardID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleAddedAttempt()));
}


