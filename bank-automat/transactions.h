#ifndef TRANSACTIONS_H
#define TRANSACTIONS_H

#include <QObject>

class Transactions : public QObject
{
    Q_OBJECT
public:
    explicit Transactions(QObject *parent = nullptr);
    void requestTransactions(QString token, QString cardID, QString cardType);
    //Offset request bodyyn parametriksi. Eteen ja taakse päin voisi kasvattaa/pienentää offset muuttujaa viidellä?
signals:

};

#endif // TRANSACTIONS_H
