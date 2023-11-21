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
    qDebug() << "Pääseekö tähän asti?";
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
