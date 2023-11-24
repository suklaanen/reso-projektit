#ifndef SETLIMITS_H
#define SETLIMITS_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class SetLimits:public QObject
{
    Q_OBJECT
public:
    SetLimits(QObject * parent = nullptr);
    void requestLimit(QString automatID);
    QString getATMLimit();
    void setLimit(QString automatID, QString newLimit);
public slots:
    void handleGetLimit();
    void handleSetLimit();
signals:
    void atmLimitReady();
    void automatCheckLimits();
    void automatSetLimits();
    void atmInsertLimitOk();
private:
    QString automatID;
    void parseLimits(const QString &data);
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString parsedAtmLimit;
    QString limit;

};

#endif // SETLIMITS_H
