#ifndef ADMINMENUINFO_H
#define ADMINMENUINFO_H

#include <QObject>
#include "withdraw.h"
#include "addmoney.h"

class AdminMenuInfo : public QObject
{
    Q_OBJECT
public:
    explicit AdminMenuInfo(QObject *parent = nullptr, Withdraw * withdraw = nullptr, AddMoney * addmoney = nullptr);
    void setAutomatID(QString);
    QString getMaxWithdrawal();
public slots:
    void getAdminMenuInfo(QString);
    void handleAtmLimit(QString);
    void handleAtmBalances();
signals:
    void limitAndBalancesReady(QString);
private:
    Withdraw * withdraw;
    AddMoney * addmoney;
    QString automatID;
    QString atmLimit;
    QString token;
};

#endif // ADMINMENUINFO_H
