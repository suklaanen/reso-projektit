#include "transactions.h"

Transactions::Transactions(QObject *parent)
    : QObject{parent}
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

Transactions::~Transactions()
{
}

void Transactions::showTransactions(QString token, QString accountID, int offset, QString type)
{
    this->token = token;
    this->accountID = accountID;
    this->offset = offset;
    this->type = type;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_account",this->accountID);
    body.insert("offset",this->offset);
    request.setUrl(QUrl("http://localhost:3000/frontendEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetTransaction()));
}

QList<QString> Transactions::getTransactions()
{
    return parsedTransactions;
}


int Transactions::maxTransactions()
{
    return maximumTransactions;
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
}

void Transactions::parseTransactions(const QString &data)
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
            qDebug() << jsonObject["time"].toString();
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QTimeZone stadi("Europe/Helsinki");
            time = time.toTimeZone(stadi);
            qDebug() << time;
            QString amount = jsonObject["amount"].toString();

            parsedTransactions.append( QString("%1    %2\t%3\n").arg(time.toString("dd.MM.yyyy hh:mm")).arg(event_type).arg(amount));
        }
    }
    if (type == "balance"){
        emit balanceTransReady();
    } else {
        emit transactionsReady();
    }
}
