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

void CheckBalance::displayBalance(QString token, QString accountID, QString cardType)

{
    this->token = token;
    this->accountID = accountID;
    this->cardType =cardType;

    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/account/getBalance/"+accountID));

    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    qDebug() << "Request URL:" << request.url().toString();

    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetBalance()));
}

void CheckBalance::handleGetBalance()
{
     QNetworkReply *reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        qDebug() << "Response Data:" << responseData;

        QJsonDocument jsonResponse = QJsonDocument::fromJson(responseData);

        if (!jsonResponse.isNull() && jsonResponse.isObject()) {
            QJsonObject jsonObject = jsonResponse.object();

            if (jsonObject.contains("balance") && jsonObject.contains("credit_limit")) {
                QString balanceString = jsonObject["balance"].toString();
                QString creditLimitString = jsonObject["credit_limit"].toString();

                bool balanceOk, creditLimitOk;
                double balance = balanceString.toDouble(&balanceOk);
                double creditLimit = creditLimitString.toDouble(&creditLimitOk);

                if (balanceOk && creditLimitOk) {
                    if (cardType == "credit") {
                        balance += creditLimit;
                    }

                    emit balanceReady(QString::number(balance, 'f', 2));
                } else {
                    qDebug() << "Invalid balance or credit_limit format";
                }
            } else {
                qDebug() << "Invalid JSON structure. Missing fields.";
            }
        } else {
            qDebug() << "Invalid JSON data format.";
        }
    } else {
        qDebug() << "Could not get balance" << reply->errorString();
    }

    reply->deleteLater();


}
