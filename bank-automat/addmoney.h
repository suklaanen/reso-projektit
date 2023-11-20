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

class AddMoney:public QObject
{
    Q_OBJECT
public:
    AddMoney(QObject * parent = nullptr);
    void requestTransactions(QString token, QString cardID, QString cardType);
    void checkAtmBalances(QString, QString, int);
    QList<QString> getAtmBalances();
public slots:
    void handleGetAtmBalances();
signals:
    void atmBalancesReady();
private:
    void parseAtmBalances(const QString &data);
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString token;
    QString automatID;
    QString atm;
    QList<QString> parsedAtmBalances;
};

#endif // ADDMONEY_H



