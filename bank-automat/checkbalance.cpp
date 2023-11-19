#include "checkbalance.h"

CheckBalance::CheckBalance(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

CheckBalance::~CheckBalance()
{
}

void CheckBalance::showBalance(QString token, QString accountID, int offset)

{
    this->token = token;
    this->accountID = accountID;
    this->offset = offset;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_account", this->accountID);
    body.insert("offset", this->offset);

    request.setUrl(QUrl("http://localhost:3000/account"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, &QNetworkReply::finished, this, &CheckBalance::handleGetBalance);
}

void CheckBalance::showTransactions(QString token, QString accountID, int offset)
{
    this->token = token;
    this->accountID = accountID;
    this->offset = offset;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_account", this->accountID);
    body.insert("offset", this->offset);

    request.setUrl(QUrl("http://localhost:3000/frontendEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    reply = manager->post(request, QJsonDocument(body).toJson());
    connect(reply, &QNetworkReply::finished, this, &CheckBalance::handleGetTransaction);
}

void CheckBalance::handleGetTransaction()
{
    QNetworkReply *networkReply = qobject_cast<QNetworkReply *>(sender());
    if (networkReply->error() == QNetworkReply::NoError) {
        QByteArray responseData = networkReply->readAll();
        if (responseData != "false") {
            returnedTransactions = responseData;
            emit transactionsReady(returnedTransactions);
        } else {
            qDebug() << "No matching account ID for transactions";
        }
    } else {
        qDebug() << "Network request error:" << networkReply->error() << networkReply->errorString();
    }
    networkReply->deleteLater();
}

void CheckBalance::handleGetBalance()
{
    QNetworkReply *networkReply = qobject_cast<QNetworkReply *>(sender());
    if (networkReply->error() == QNetworkReply::NoError) {
        QByteArray responseData = networkReply->readAll();
        if (responseData != "false") {
            returnedBalance = responseData;
            emit balanceReady(returnedBalance);
        } else {
            qDebug() << "No matching account ID for balance";
        }
    } else {
        qDebug() << "Network request error:" << networkReply->error() << networkReply->errorString();
    }
    networkReply->deleteLater();
}
