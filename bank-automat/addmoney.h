#ifndef ADDMONEY_H
#define ADDMONEY_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class AddMoney
{
    Q_OBJECT
public:
    AddMoney();
signals:
    void automatAddMoney();
};

#endif // ADDMONEY_H
