#include "addmoney.h"

// ** AddMoney ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta
// Automaatin käyttövarojen tarkastaminen on valmis
// Käyttövarojen lisääminen ei aloitettu


AddMoney::AddMoney(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

void AddMoney::checkAtmBalances (QString token, QString automatID, int offset)
{
    this->token = token;
    this->automatID = automatID;
    this->offset = offset;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",this->automatID);
    body.insert("offset",this->offset);
    request.setUrl(QUrl("http://localhost:3000/automat/getBalances/"+automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetAtmBalances()));
    //qDebug() << "Pääseekö tähän asti?";
}

QList<QString> AddMoney::getAtmBalances()
{
    return parsedAtmBalances;
}

void AddMoney::handleGetAtmBalances()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        parseAtmBalances(responseData);
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void AddMoney::parseAtmBalances(const QString &data)
{
    parsedAtmBalances.clear();
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());

    QJsonObject jsonObject = jsonResponse.object();
        qDebug() << jsonObject ;
    parsedAtmBalances.append(QString::number(jsonObject["balance_10"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_20"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_50"].toInt()));
    parsedAtmBalances.append(QString::number(jsonObject["balance_100"].toInt()));

    emit atmBalancesReady();
}


// Lisää käyttövaroja automaattiin -alkaa

void AddMoney::insertValueOf10s(QString amount)
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney10/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues()));
}


void AddMoney::insertValueOf20s(QString amount)
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney20/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues()));
}


void AddMoney::insertValueOf50s(QString amount)
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney50/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues()));
}


void AddMoney::insertValueOf100s(QString amount)
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",automatID);
    body.insert("amount",amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney100/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues()));
    //qDebug() << "Pääseekö tähän asti?";
}

void AddMoney::handleInsertValues()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");
        qDebug() << "Withdraw response: " << QString(responseData);
        emit atmInsertValuesOk();
    } else {
        qDebug() << "Could not get response" << reply->errorString();
    }
    reply->deleteLater();
}

void AddMoney::handleAddedMoney()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    emit atmAddMoneyOk();
    reply->deleteLater();
}
