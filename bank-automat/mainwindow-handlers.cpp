#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// ** Handlers ** Käsittelijät *********************************************************
// ***** Erilaisia käsittelijöitä on sijoitettu tänne **********************************
// *************************************************************************************

// Tämä käsittelee painikkeiden klikkaamisen
void MainWindow::clickedNumberHandler()
{
    if(state == SELECT_CARD || state == CARD_OK || state == CARD_FAIL || state == LOGIN_FAIL ||
        state == USER_INSERT_AMOUNT || state == ATM_ADDMONEY_AMOUNT || state == AUTOMAT_SET_MAX_WITHDRAWAL) {
        QPushButton * btn = qobject_cast<QPushButton*>(sender());
        QString name = btn->objectName();
        qDebug()<< name << " -button clicked";

        QString content = ui->Content->text();

        if (content.length() < 4) {
            content.append(name.last(1));
            ui->Content->setText(content);
        }
        if(state == USER_INSERT_AMOUNT) {
            checkAtmLimit();
            timer->start(10000);
        }
        if(state == ATM_ADDMONEY_AMOUNT || state == AUTOMAT_SET_MAX_WITHDRAWAL) {
            timer->start(30000);
        }
        if (state == CARD_OK || state == LOGIN_FAIL) {
            ui->Content->setEchoMode(QLineEdit::Password);
            timer->start(10000);
        } else {
            ui->Content->setEchoMode(QLineEdit::Normal);
        }
    }
}

void MainWindow::handleTimeout()
{
    switch(state) {
    case CARD_OK:
    case LOGIN_FAIL:
    case WITHDRAWAL_OK:
    case CARD_LOCKED:
    case USER_MENU:
    case ADMIN_MENU:
        login->requestLogout();
        break;
    case USER_BALANCE:
    case USER_TRANSACTIONS:
    case USER_WITHDRAWAL:
        showMenu(token,accountID);
        break;
    case USER_INSERT_AMOUNT:
    case WITHDRAWAL_FAIL:
        showWithdrawal();
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY_AMOUNT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
    case AUTOMAT_VIEW_LOG:
    case ATM_MONEYSENT:
        adminMenu->getAdminMenuInfo(token);
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}
