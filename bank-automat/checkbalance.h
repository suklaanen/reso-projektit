
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

class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject* parent = nullptr);
    ~CheckBalance();
    void requestBalance(QString token, QString cardID, QString cardType);
    void requestTransactions(QString token, QString cardID, QString cardType);
    void showTransactions(QString, QString, int);
    void showBalance(QString, QString, int);
    QString token;

public slots:
    void handleGetTransaction();
    void handleGetBalance();

signals:
    void balanceReady(const QString& data);
    void transactionsReady(const QString& data);
    void userTransactions();

private:
    QString accountID;
    QString cardID;
    int offset;
    QNetworkAccessManager* manager;
    QNetworkReply* reply;
    QString returnedTransactions;
    QString returnedBalance;

};

#endif // CHECKBALANCE_H
