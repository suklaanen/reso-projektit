#include "withdraw.h"

Withdraw::Withdraw(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

void Withdraw::setAmount(QString amount)
{
    this->amount = amount;
    qDebug() << "Amount received: " << this->amount;
}

void Withdraw::setInfo(QString token, QString accountID, QString cardID, QString cardType)
{
    this->token = token;
    this->accountID = accountID;
    this->cardID = cardID;
    this->cardType = cardType;
    this->automatID = "1";
    requestAtmLimit();
}

void Withdraw::handleAtmLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        maxWithdrawal = QString(responseData);
        emit atmLimitReady(maxWithdrawal);
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get automat limit" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void Withdraw::requestAtmLimit()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleAtmLimit()));
}
