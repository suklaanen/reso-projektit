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
    ~AddMoney();
    void requestTransactions(QString token, QString cardID, QString cardType);
    void checkAtmBalances(QString, QString);
    void insertValueOf(const QString &denomination, QString amount);
    QList<QString> getAtmBalances();
    QList<QString> getAddedMoney();
public slots:
    void handleGetAtmBalances();
    void handleInsertValues();
signals:
    void atmBalancesReady();
    void atmInsertValuesOk(QString);
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
