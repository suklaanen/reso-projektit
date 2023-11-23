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
    void insertValueOf10s(QString amount);
    void insertValueOf20s(QString amount);
    void insertValueOf50s(QString amount);
    void insertValueOf100s(QString amount);
    QList<QString> getAtmBalances();
    QList<QString> getAddedMoney();
public slots:
    void handleGetAtmBalances();
    void handleAddedMoney();
    void handleInsertValues();
signals:
    void atmBalancesReady();
    void atmInsertValuesOk();
    void atmAddMoneyOk();
private:
    void parseAtmBalances(const QString &data);
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString token;
    QString automatID;
    QString amount;
    QList<QString> parsedAtmBalances;
};

#endif // ADDMONEY_H



