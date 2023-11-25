#include "adminmenuinfo.h"

AdminMenuInfo::AdminMenuInfo(QObject *parent, Withdraw * withdraw, AddMoney * addmoney)
    : QObject{parent}
{
    this->withdraw = withdraw;
    this->addmoney = addmoney;
}

void AdminMenuInfo::setAutomatID(QString automatID)
{
    this->automatID = automatID;
}

QString AdminMenuInfo::getMaxWithdrawal()
{
    return this->atmLimit;
}

void AdminMenuInfo::getAdminMenuInfo(QString token)
{
    this->token = token;
    withdraw->requestAtmLimit(automatID, "adminMenu");
}

void AdminMenuInfo::handleAtmLimit(QString atmLimit)
{
    this->atmLimit = atmLimit;
    addmoney->checkAtmBalances(token,automatID,"adminmenu");

}

void AdminMenuInfo::handleAtmBalances()
{
    emit limitAndBalancesReady(token);
}
