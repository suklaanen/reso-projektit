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
    void requestTransactions(QString token, QString cardID, QString cardType);
    //Offset request bodyyn parametriksi. Eteen ja taakse päin voisi kasvattaa/pienentää offset muuttujaa viidellä?
signals:

private:
    QString showTransactions(int ln);
};

#endif // TRANSACTIONS_H
