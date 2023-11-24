#include "setlimits.h"

// ** SetLimits ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta

SetLimits::SetLimits(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

SetLimits::~SetLimits()
{
}

void SetLimits::requestLimit(QString automatID)
{
    this->automatID = automatID;
    qDebug() << "Request limit, automatID"<<this->automatID;
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",this->automatID);
    request.setUrl(QUrl("http://localhost:3000/automat/getAtmLimit/"+automatID));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->get(request);
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetLimit()));
}


void SetLimits::setLimit(QString automatID, QString newLimit)
{
    qDebug()<<"Setlimit";
    this->automatID = automatID;
    this->limit = newLimit;
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_automat",this->automatID);
    body.insert("ATMlimit",this->limit);
    request.setUrl(QUrl("http://localhost:3000/automat/setATMLimit/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->put(request, QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleSetLimit()));
}

QString SetLimits::getATMLimit()
{
    return parsedAtmLimit;
}

void SetLimits::handleGetLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        qDebug() << "handleGetLimit onnistunut vastaus" ;
        QByteArray responseData = reply->readAll();
        parseLimits(responseData);
    }else{
        qDebug() << "handleGetLimit epäonnistunut vastaus" ;
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void SetLimits::handleSetLimit()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        QString response = QString(responseData).replace("\"", "");

        if (response == "success") {
            emit atmInsertLimitOk(this->automatID);
        } else {
            qDebug() << "Unexpected response: " << response;
        }
    } else {
        qDebug() << "Could not get response" << reply->errorString();
    }
    reply->deleteLater();
}

void SetLimits::parseLimits(const QString &data)
{
    qDebug() << "parseLimits. data:" << data ;
    parsedAtmLimit = data;
    emit atmLimitReady();
}
