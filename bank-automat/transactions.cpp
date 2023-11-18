#include "transactions.h"

Transactions::Transactions(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

void Transactions::showTransactions(QString token, QString accountID, int offset)
{
    this->token = token;
    this->accountID = accountID;
    this->cardID = cardID;
    this->offset = offset;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_account",this->accountID);
    body.insert("offset",this->offset);
    request.setUrl(QUrl("http://localhost:3000/frontendEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetTransaction()));

}

void Transactions::handleGetTransaction()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            //qDebug() << responseData;
            returnedTransactions = responseData;
            emit transactionsReady(returnedTransactions);
        }
        else {
            qDebug() << "No matching account ID";
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get account ID" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}
