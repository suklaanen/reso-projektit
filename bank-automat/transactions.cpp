#include "transactions.h"

Transactions::Transactions(QObject *parent)
    : QObject{parent}
{

}

QString Transactions::showTransactions(int ln)
{
    //Haetaan tietokannasta taulusta eventlog tapahtuma ln ja tallennetaan se muuttujaan string_ln
    QString string_ln="";
    string_ln=QString("tähän noutokoodi(ln)");
    return string_ln;
};
