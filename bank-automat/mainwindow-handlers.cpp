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
        }
        if (state == CARD_OK || state == LOGIN_FAIL) {
            ui->Content->setEchoMode(QLineEdit::Password);
            timer->stop();
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
        showLogin();
        break;
    case LOGIN_FAIL:
        showLogin();
        break;
    case WITHDRAWAL_OK:
        showLogin();
        break;
    case CARD_LOCKED:
        showLogin();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}
