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
public slots:
    void handleGetLimit();
signals:
    void automatCheckLimits();
    void automatSetLimits();
private:
    QString automatID;
    void parseLimits(const QString &data);
    QNetworkAccessManager *manager;
    QNetworkReply *reply;

};

#endif // SETLIMITS_H
