#ifndef CHECKBALANCE_H
#define CHECKBALANCE_H

#include <QObject>

class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject *parent = nullptr);

signals:

};

#endif // CHECKBALANCE_H
