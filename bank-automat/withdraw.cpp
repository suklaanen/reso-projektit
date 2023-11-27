#include "withdraw.h"

Withdraw::Withdraw(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

Withdraw::~Withdraw()
{
}

void Withdraw::setAmount(QString amount)
{
    this->amount = amount;
    qDebug() << "Amount received: " << this->amount;
    requestWithdrawal();
}

void Withdraw::setInfo(QByteArray token, QString accountID, QString cardID, QString cardType, QString automatID)
{
    this->token = token;
    this->accountID = accountID;
    this->cardID = cardID;
    this->cardType = cardType;
    this->automatID = automatID;
    requestAtmLimit(this->token,this->automatID, "withdraw");
}

void Withdraw::handleAtmLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        maxWithdrawal = QString(responseData);
        if(callingClass == "withdraw") {
            emit atmLimitReady(maxWithdrawal);
        }
        else {
            emit atmLimitToAdminMenu(maxWithdrawal);
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get automat limit" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void Withdraw::handleWithdrawal()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");
        qDebug() << "Withdraw response: " << QString(responseData);
        if(response == "account limit exceeded") {
            emit withdrawFailure("Tilin nostorajat ylittyy");
        }
        else if(response == "withdrawal ok") {
            emit withdrawalOk(amount);
        }
        else if(response == "not enough bills") {
            emit withdrawFailure("Oikeankokoiset setelit lopussa");
        }
        else if(response == "not enough balance") {
            emit withdrawFailure("Tilin kate ei riitä");
        }

    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get response from withdrawal" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void Withdraw::requestAtmLimit(QByteArray token,QString automatID,QString callingclass)
{
    callingClass = callingclass;
    this->token = token;
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(this->token));
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAtmLimit()));
}

void Withdraw::requestWithdrawal()
{
    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token));
    QJsonObject body;
    body.insert("id_account",accountID);
    body.insert("id_card",cardID);
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/account/attemptWithdrawal"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleWithdrawal()));
}
