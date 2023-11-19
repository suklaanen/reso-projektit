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

/* POISTUVAA ? Vai ei
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
} */

void CheckBalance::handleGetBalance()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        QString balance = QString(responseData);
        emit balanceReady(balance);
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

/*
QList<QString> CheckBalance::getBalance()
{
    return parsedBalance;
}

void CheckBalance::parseBalance(const QString &data)
{
    parsedBalance.clear();
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());


    QJsonArray jsonArray = jsonResponse.array();

    for (const auto& jsonValue : jsonArray) {
        //QString balance;
        if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();
            QString balance = jsonObject["balance"].toString();

            parsedBalance.append( QString(balance));
        }
    }
    emit balanceReady();
} */


/* LIITTYVÄT TRANSAKTIOIHIN ?
 *
void CheckBalance::displayTransactions(QString, QString, int)
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

QList<QString> CheckBalance::getTransactions()
{
    return parsedTransactions;
}

int CheckBalance::maxTransactions()
{
    return maximumTransactions;
}

void CheckBalance::handleGetTransaction()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            //qDebug() << responseData;
            //returnedTransactions = responseData;
            //emit transactionsReady(returnedTransactions);
            maximumTransactions = reply->rawHeader("X-Transactions-Count").toInt();
            parseTransactions(responseData);
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
}*/

void CheckBalance::parseTransactions(const QString &data)
{
    parsedTransactions.clear();
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    if (!jsonResponse.isArray()) {
        qDebug() << "Invalid JSON data format.";
        return;
    }

    QJsonArray jsonArray = jsonResponse.array();

    for (const auto& jsonValue : jsonArray) {
        QString event_type;
        if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();

            if (jsonObject["event_type"].toString()=="withdrawal"){//withdrawal käännettynä suomeksi, muuta mahdolliset tapahtumat saa mennä ominaan.
                event_type = "Nosto";
            }
            else {
                event_type = jsonObject["event_type"].toString();
            }
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QString amount = jsonObject["amount"].toString();

            parsedTransactions.append( QString("%1\t  %2\t\t%3\n").arg(time.toString("dd.MM.-yy hh:mm")).arg(event_type).arg(amount));
        }
    }
    emit transactionsReady();
}

/* POISTUVAAko ?
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
} */
