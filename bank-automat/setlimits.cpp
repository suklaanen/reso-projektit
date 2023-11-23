#include "setlimits.h"

// ** SetLimits ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta

SetLimits::SetLimits(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

void SetLimits::requestLimit(QString automatID)
{
    this->automatID = automatID;
    qDebug() << "Request limit";
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",this->automatID);
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetLimit()));
}

void SetLimits::handleGetLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        qDebug() << "Pääseekö tänne" ;
        QByteArray responseData = reply->readAll();
        parseLimits(responseData);
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void SetLimits::parseLimits(const QString &data)
{
    QJsonDocument jsonResponse = QJsonDocument::fromJson(data.toUtf8());
    QJsonObject jsonObject = jsonResponse.object();
    qDebug() << jsonObject ;
    parsedAtmLimit.append(QString::number(jsonObject["max_withdrawal"].toInt()));
    //emit atmBalancesReady();// jatka tästä!
}
