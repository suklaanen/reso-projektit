#include "withdraw.h"

Withdraw::Withdraw(QObject *parent)
    : QObject{parent}
{

}

void Withdraw::setAmount(QString amount)
{
    this->amount = amount;
    qDebug() << "Amount received: " << this->amount;
}

void Withdraw::setInfo(QString token, QString accountID, QString cardID, QString cardType)
{
    this->token = token;
    this->accountID = accountID;
    this->cardID = cardID;
    this->cardType = cardType;
}
