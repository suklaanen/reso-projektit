#ifndef TRANSACTIONS_H
#define TRANSACTIONS_H

#include <QObject>

class Transactions : public QObject
{
    Q_OBJECT
public:
    explicit Transactions(QObject *parent = nullptr);

signals:

};

#endif // TRANSACTIONS_H
