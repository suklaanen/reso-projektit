#include "viewlog.h"

// ** ViewLog ** -liittyy automaatin hallinnointiin (ATM) ja siihen päästään admin näkymästä, ADMIN_MENU kautta

ViewLog::ViewLog(QObject * parent): QObject(parent)
{
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
}

ViewLog::~ViewLog()
{
}

void ViewLog::requestEvents(QByteArray token, QString automatID, int offset)
{
    this->token = token;
    this->automatID = automatID;
    this->offset = offset;

    QNetworkRequest request;
    request.setRawHeader(QByteArray("Authorization"),(token));
    request.setUrl(QUrl("http://localhost:3000/frontendEvents/allEvents"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    QJsonObject body;
    body.insert("offset",this->offset);
    body.insert("automat_id",this->automatID);
    reply = manager->post(request,QJsonDocument(body).toJson());
    connect(reply, SIGNAL(finished()), this, SLOT(handleGetEvents()));
}

QList<QString> ViewLog::getEvents()
{
    return parsedEvents;
}

int ViewLog::maxEvents()
{
    return maximumEvents;
}

void ViewLog::handleGetEvents()
{
    QNetworkReply * reply = qobject_cast<QNetworkReply*>(sender());
    if (reply->error() == QNetworkReply::NoError) {
        // Onnistunut vastaus
        QByteArray responseData = reply->readAll();
        // Käsitellään vastaus
        if(responseData != "false") {
            maximumEvents = reply->rawHeader("X-Transactions-Count").toInt();
            parseEvents(responseData);
        }
        else {
            qDebug() << "Error in database query";
        }
    } else {
        // Käsitellään mahdollinen virhe (verkkovirhe)
        qDebug() << "Could not get all events" << reply->errorString();
    }
    // Tyhjennetään vastaus myöhemmin
    reply->deleteLater();
}

void ViewLog::parseEvents(const QString &data)
{
    parsedEvents.clear();
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
            qDebug() << jsonObject;
            if (jsonObject["event_type"].toString()=="withdrawal"){
                event_type = "Nosto";
            }
            else if(jsonObject["event_type"].toString()=="withdrawal attempt, not enough bills" ||
                    jsonObject["event_type"].toString()=="withdrawal attempt, not enough" ||
                    jsonObject["event_type"].toString()=="withdrawal attempt") {
                event_type = "Nostoyritys";
            }
            else if(jsonObject["event_type"].toString()=="login") {
                event_type = "Login";
            }
            else if(jsonObject["event_type"].toString()=="logout") {
                event_type = "Logout";
            }
            else if(jsonObject["event_type"].toString()=="login attempt") {
                event_type = "Login yritys";
            }
            else if(jsonObject["event_type"].toString()=="added money 10") {
                event_type = "Lisätty 10€";
            }
            else if(jsonObject["event_type"].toString()=="added money 20") {
                event_type = "Lisätty 20€";
            }
            else if(jsonObject["event_type"].toString()=="added money 50") {
                event_type = "Lisätty 50€";
            }
            else if(jsonObject["event_type"].toString()=="added money 100") {
                event_type = "Lisätty 100€";
            }
            else {
                event_type = jsonObject["event_type"].toString();
            }
            qDebug() << jsonObject["time"].toString();
            QDateTime time = QDateTime::fromString(jsonObject["time"].toString(), Qt::ISODate);
            QTimeZone stadi("Europe/Helsinki");
            time = time.toTimeZone(stadi);
            qDebug() << time;
            QString amount = "-";
            if(jsonObject["amount"].toString()!="NULL") {
                amount = jsonObject["amount"].toString();
            }
            QString card = QString::number(jsonObject["id_card"].toInt());
            qDebug() << "ID CARD: " << card;
            parsedEvents.append( QString("%1    %2  %3\t%4\n").arg(time.toString("dd.MM.yy hh:mm")).arg(card).arg(event_type).arg(amount));
        }
    }
    emit LogReady();
}
