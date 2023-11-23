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
    /*QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString balance = QString(responseData).replace("\"", "");


        emit balanceReady(balance);
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();*/

  QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString balanceString = QString(responseData).replace("\"", "");

        // Muunna saldo liukuluvuksi
        bool ok;
        double balance = balanceString.toDouble(&ok);

        if (ok) {
            // Käsittely credit-kortin tapauksessa
            if (cardType == "credit") {
                // Käytä QJsonDocumentia parsimaan vastaus JSON-objektiksi
                QJsonDocument jsonResponse = QJsonDocument::fromJson(responseData);

                // Tarkista, että vastaus on JSON-objekti
                if (jsonResponse.isObject()) {
                    QJsonObject jsonObject = jsonResponse.object();
                    double creditLimit = jsonObject["credit_limit"].toDouble();

                    // Lisää luottoraja saldoon
                    balance += creditLimit;
                } else {
                    qDebug() << "Invalid JSON data format.";
                }
            }

            emit balanceReady(QString::number(balance));
        } else {
            qDebug() << "Invalid balance format";
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get balance" << reply->errorString();
    }

    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();



}
