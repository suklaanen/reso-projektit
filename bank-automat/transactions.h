#ifndef TRANSACTIONS_H
#define TRANSACTIONS_H

#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QObject>

class Transactions : public QObject
{
    Q_OBJECT
public:
    explicit Transactions(QObject *parent = nullptr);
    void showTransactions(QString, QString, int);
    QList<QString> getTransactions();
    int maxTransactions();
public slots:
    void handleGetTransaction();
signals:
    void transactionsReady();
    void userTransactions();
private:
    void parseTransactions(const QString &data);
    QString token;
    QString accountID;
    QString cardID;
    int offset;
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString returnedTransactions;
    QList<QString> parsedTransactions;
    int maximumTransactions;
};

#endif // TRANSACTIONS_H
