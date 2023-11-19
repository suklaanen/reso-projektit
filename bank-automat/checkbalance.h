#ifndef CHECKBALANCE_H
#define CHECKBALANCE_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>
#include <QJsonObject>

class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject* parent = nullptr);
    ~CheckBalance();
    void requestBalance(QString token, QString accountID);
    void displayBalance(QString, QString);
    QList<QString> getBalance();
    void requestTransactions(QString token, QString cardID, QString cardType);
    void displayTransactions(QString, QString, int);
    QList<QString> getTransactions();
    int maxTransactions();
public slots:
    void handleGetBalance();
    //void handleGetTransaction();
    //void handleTransactionsReady(const QString &data);
    //void handleBalanceReady(const QString &data);
signals:
    void balanceReady(QString balance);
    void userBalance();
    void transactionsReady();
    void userTransactions();
private:
    void parseTransactions(const QString &data);
    void parseBalance(const QString &data);
    QString token;
    QString accountID;
    QString cardID;
    int offset;
    QString saldo;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString returnedTransactions;
    QList<QString> parsedTransactions;
    QList<QString> parsedBalance;
    int maximumTransactions;
};


/* POISTUVAA:
 *
class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject* parent = nullptr);
    ~CheckBalance();
    //void requestBalance(QString token, QString cardID, QString cardType);
    //void requestTransactions(QString token, QString cardID, QString cardType);
    //void showTransactions(QString, QString, int);
    //void showBalance(QString, QString, int);
    QString token;
    void showBalance(QString token, QString accountID, int offset);

    void requestBalance(QString token, QString accountID, int offset);
public slots:
    //void handleGetTransaction();
    void handleGetBalance();

signals:
    void balanceReady(const QString& data);
    //void transactionsReady(const QString& data);
    //void userTransactions();

private:
    QString accountID;
    QString cardID;
    int offset;
    QNetworkAccessManager* manager;
    QNetworkReply* reply;
    //QString returnedTransactions;
    QString returnedBalance;

};*/

#endif // CHECKBALANCE_H

