#ifndef CHECKBALANCE_H
#define CHECKBALANCE_H

#include <QObject>

class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject *parent = nullptr);
    ~CheckBalance();

public slots:
    void showBalance();
    void showFiveLastEvent();

signals:

private:
    void requestAccount();

};

#endif // CHECKBALANCE_H
