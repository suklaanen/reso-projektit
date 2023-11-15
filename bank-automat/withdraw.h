#ifndef WITHDRAW_H
#define WITHDRAW_H

#include <QObject>

class Withdraw : public QObject
{
    Q_OBJECT
public:
    explicit Withdraw(QObject *parent = nullptr);

signals:

};

#endif // WITHDRAW_H
