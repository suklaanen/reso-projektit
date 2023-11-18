#ifndef WITHDRAW_H
#define WITHDRAW_H

#include <QObject>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class Withdraw : public QObject
{
    Q_OBJECT
public:
    explicit Withdraw(QObject *parent = nullptr);
    void setAmount(QString);
    void setInfo(QString, QString, QString, QString);

signals:

private:
    QString token;
    QString accountID;
    QString cardID;
    QString cardType;
    QString amount;
};

#endif // WITHDRAW_H
