#include "login.h"

Login::Login(QWidget *parent) :
    QWidget(parent)
{
    cardID = "";
    pin = "";
    state = 0;
    cardType = "";
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    loginTimer = new QTimer;
    loginTimer->setSingleShot(false);
}

Login::~Login()
{

}

void Login::setCardID(QString inputCardID)
{
    cardID = inputCardID;
    requestCardID();
}

void Login::setPIN(QString inputPin)
{
    pin = inputPin;
    requestLogin();
}

void Login::handleCard()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Successful response
        QByteArray responseData = reply->readAll();
        // Process responseData as needed

        if(responseData == "false") {
            emit cardFail();
        }
        else {
            cardType = QString(responseData);

            if (cardID.toInt() < 1) {
                emit cardFail();
            } else {
                if(cardType == "debit/credit") {
                    emit cardOkSelectType();
                } else {
                    emit cardOk (cardType);

                }

            }
        }
    } else {
        // Handle the error
        qDebug() << "Couldnt get card type" << reply->errorString();
    }
    // Clean up the reply
    reply->deleteLater();
}

void Login::handlePin()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        // Successful response
        QByteArray responseData = reply->readAll();
        // Process responseData as needed

        //if(responseData.length()>20) {
        if(checkPinOk(QString(responseData))) {
            emit loginOk();
        }
        else {
            emit loginFail();
        }
    } else {
        // Handle the error
        qDebug() << "Could not login" << reply->errorString();
    }
    // Clean up the reply
    reply->deleteLater();
}

void Login::requestCardID()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/card/"+cardID));
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleCard()));
}

void Login::requestLogin()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("pin",pin);
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handlePin()));
}

void Login::activate(bool on_off)
{
    active = on_off;
}

bool Login::checkPinOk(const QString& enteredPIN)
{
    // toteutus tähän ehkä, eos
}
