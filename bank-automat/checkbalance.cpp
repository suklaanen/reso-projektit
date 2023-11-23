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

void CheckBalance::displayBalance(QString token, QString accountID)

{
    this->token = token;
    this->accountID = accountID;

    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/account/getBalance/"+accountID));

    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    qDebug() << "Request URL:" << request.url().toString();

    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetBalance()));
}

void CheckBalance::handleGetBalance()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString balance = QString(responseData).replace("\"", "");
        emit balanceReady(balance);
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}
