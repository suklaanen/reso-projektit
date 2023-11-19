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
public slots:
    void handleAtmLimit();
signals:
    void atmLimitReady(QString limit);
private:
    QString token;
    QString accountID;
    QString cardID;
    QString cardType;
    QString amount;
    QString automatID;
    QString maxWithdrawal;
    QNetworkAccessManager * manager;
    QNetworkReply * reply;
    void requestAtmLimit();
};

#endif // WITHDRAW_H
