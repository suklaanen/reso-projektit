#include "addmoney.h"

// ** AddMoney ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta
// Automaatin käyttövarojen tarkastaminen on valmis
// Käyttövarojen lisääminen ei aloitettu

AddMoney::AddMoney(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

AddMoney::~AddMoney()
{
}

void AddMoney::checkAtmBalances (QString token, QString automatID,QString callingclass)
{
    this->token = token;
    this->automatID = automatID;
    this->callingclass = callingclass;

    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",this->automatID);
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

void AddMoney::setDenomination(QString denomination)
{
    this->denomination = denomination;
}

QString AddMoney::getDenomination()
{
    return this->denomination;
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

    if(callingclass == "main") {
        emit atmBalancesReady();
    }
    else {
        emit atmBalancesToAdminMenu();
    }
}

// Lisää käyttövaroja automaattiin -alkaa tästä
void AddMoney::insertValueOf(QString amount)
{
    this->amount = amount;
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat", automatID);
    body.insert("amount", amount);
    request.setUrl(QUrl("http://localhost:3000/automat/addMoney" + denomination));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleInsertValues()));
}

void AddMoney::handleInsertValues() {
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");

        if (response == "succes") {
            emit atmInsertValuesOk(this->amount);
        } else {
            qDebug() << "Unexpected response: " << response;
        }
    } else {
        qDebug() << "Could not get response" << reply->errorString();
    }
    reply->deleteLater();
}

