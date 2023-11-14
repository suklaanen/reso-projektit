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


void Login::handleResponse(QNetworkReply *reply)
{
    if (reply->error() == QNetworkReply::NoError) {
        // Successful response
        QByteArray responseData = reply->readAll();
        // Process responseData as needed
        if(state == 0) {
            if(responseData == "false") {
                emit cardFail();
            }
            else {
                state = 1;
                cardType = QString(responseData);
                emit cardOk (cardType);
            }
        }
        else if(state == 1) {
            if(responseData.length()>20) {
                emit loginOk();
            }
            else {
                emit loginFail();
            }
        }
    } else {
        // Handle the error
        qDebug() << "Network request failed:" << reply->errorString();
    }
    // Clean up the reply
    reply->deleteLater();
}

void Login::handleCard()
{
    // kesken
}

void Login::handlePin()
{
    // kesken
}

// kesken
void Login::requestCardID()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/card/"+cardID));
    reply = manager->get(request);
    //connect(reply, SIGNAL());
}

//kesken
void Login::requestLogin()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",cardID);
    body.insert("pin",pin);
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
}

// kesken
void Login::activate(bool on_off)
{
    active = on_off;
}
