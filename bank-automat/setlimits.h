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

    QString getATMLimit();
public slots:
    void requestLimit(QString automatID);
    void setLimit(QString automatID, QString newLimit);
    void handleGetLimit();
    void handleSetLimit();
signals:
    void atmLimitReady();
    void automatCheckLimits();
    void automatSetLimits();
    void atmInsertLimitOk(QString);
private:
    QString automatID;
    void parseLimits(const QString &data);
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString parsedAtmLimit;
    QString limit;

};

#endif // SETLIMITS_H
