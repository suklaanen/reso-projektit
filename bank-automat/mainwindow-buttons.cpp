#include "mainwindow.h"
#include "ui_mainwindow.h"

// -------------------------------------------------------------------------------------
// ** Painikkeet ** ja napit alkavat tästä sekä niistä etenemiset switch casella
// case NIMI:   kertoo "nykyisen" vaiheen (state) ja se ilmaistaan tiloissa alempana
// -------------------------------------------------------------------------------------

// Tähän tulee kaikki toiminnot, mitä vihreästä OK-napista tapahtuu Caseina

void MainWindow::atmClicked()
{
    QPushButton * atm_btn = qobject_cast<QPushButton*>(sender());
    QString atm_id = atm_btn->objectName();
    qDebug()<<"ATM1 button clicked";
    automatID = atm_id.last(1);

    ui->Mapframe->hide();

    showLogin();
    state = SELECT_CARD;
}

void MainWindow::atm2Clicked()
{
    qDebug()<<"ATM2 button clicked";
    automatID = "2";

    ui->Mapframe->hide();

    showLogin();
    state = SELECT_CARD;
}

void MainWindow::atm3Clicked()
{
    qDebug()<<"ATM3 button clicked";
    automatID = "3";

    ui->Mapframe->hide();

    showLogin();
    state = SELECT_CARD;
}

void MainWindow::atm4Clicked()
{
    qDebug()<<"ATM4 button clicked";
    automatID = "4";

    ui->Mapframe->hide();

    showLogin();
    state = SELECT_CARD;
}

void MainWindow::clickedGREEN()
{
    //QString amountToAdd = ui->Content->text();
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        if(ui->Content->text() != "") {
            ID = ui->Content->text();
            login->setCardID(ui->Content->text(),automatID);
        }
        else {
            login->setCardID("0",automatID);
        }
        break;
    case CARD_FAIL:
        if(ui->Content->text() != "") {
            ID = ui->Content->text();
            login->setCardID(ui->Content->text(),automatID);
        }
        else {
            login->setCardID("0",automatID);
        }
        break;
    case CARD_OK:
        login->setPIN(ui->Content->text(),cardType);
        timer->stop();
        break;
    case CARD_COMBINATION:
        break;
    case LOGIN_FAIL:
        login->setPIN(ui->Content->text(),cardType);
        timer->stop();
        break;
    case USER_MENU:
        break;
    case ADMIN_MENU:
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Amount inserted, green clicked";
        withdraw->setAmount(ui->Content->text());
        break;
    case ATM_ADDMONEY10:
        atmBalances->insertValueOf("10", ui->Content->text());
        break;
    case ATM_ADDMONEY20:
        atmBalances->insertValueOf("20", ui->Content->text());
        break;
    case ATM_ADDMONEY50:
        atmBalances->insertValueOf("50", ui->Content->text());
        break;
    case ATM_ADDMONEY100:
        atmBalances->insertValueOf("100", ui->Content->text());
        break;
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        setlimits->setLimit(automatID, ui->Content->text());
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Keltaisen painikkeen "kumita kaikki merkit" toiminto
void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
    ui->Content->clear();
    switch(state) {
    case CARD_OK:
        timer->stop();
        timer->start(10000);
        break;
    case LOGIN_FAIL:
        timer->stop();
        timer->start(10000);
        break;
    case USER_INSERT_AMOUNT:
        checkAtmLimit();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Harmaan painikkeen "kumita yksi merkki" toiminto
void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
    switch(state) {
    case CARD_OK:
        timer->stop();
        timer->start(10000);
        break;
    case LOGIN_FAIL:
        timer->stop();
        timer->start(10000);
        break;
    case USER_INSERT_AMOUNT:
        checkAtmLimit();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Punaisen painikkeen "keskeytä" STOP -toiminto, joka palaa alkutilaan
void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    state = SELECT_CARD;
    showLogin();
}

// Sivu painike numero 1 , vasemmalla
void MainWindow::button1Clicked()
{
    switch(state) {
    case USER_TRANSACTIONS:
        qDebug() << "Uudemmat clicked";
        if (offset>0){
            offset=offset-5;
        }else
        {
            offset=0;
        }
        qDebug() << "offset: "<< offset;
        transactions->showTransactions(token, accountID, offset, QString("transactions"));
        break;
    case AUTOMAT_VIEW_LOG:
        qDebug() << "Uudemmat clicked";
        if (offset>0){
            offset=offset-5;
        }else
        {
            offset=0;
        }
        qDebug() << "offset: "<< offset;
        viewlog->requestEvents(token, automatID, offset);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 10 clicked";
        withdraw->setAmount(QString("10"));
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 2 , vasemmalla
void MainWindow::button2Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM Events -clicked";
        offset = 0;
        viewlog->requestEvents(token, automatID, offset);
        break;
    case USER_MENU:
        qDebug() << "User Balance -clicked";
        offset = 0;
        transactions->showTransactions(token, accountID, offset, QString("balance"));
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 20 clicked";
        withdraw->setAmount(QString("20"));
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY20:
    case ATM_ADDMONEY50:
    case ATM_ADDMONEY100:
        qDebug() << "Add Money 10 -clicked";
        showAddMoney10();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 3 , vasemmalla
void MainWindow::button3Clicked()
{
    switch(state) {

    case ADMIN_MENU:
        qDebug() << "ATM balance -clicked";
        atmBalances->checkAtmBalances(token, automatID);
        break;
    case USER_MENU:
        qDebug() << "transactions clicked";
        offset = 0;
        transactions->showTransactions(token, accountID, offset, QString("transactions"));
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 40 clicked";
        withdraw->setAmount(QString("40"));
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY10:
    case ATM_ADDMONEY50:
    case ATM_ADDMONEY100:
        qDebug() << "Add Money 20 -clicked";
        showAddMoney20();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 4 , vasemmalla (useimmin meillä "palaa takaisin")
void MainWindow::button4Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("debit");
        qDebug() << "debit clicked";
        break;
    case ADMIN_MENU:
        qDebug() << "ATM Add money -clicked";
        showAddMoney();
        break;
    case USER_MENU:
        qDebug() << "User Withdrawal -clicked";
        showWithdrawal();  // tai vastaavan niminen slotti
        break;
    case USER_BALANCE:
        qDebug() << "Paluu clicked";
        offset=0;
        showMenu(token, accountID);
        break;
    case USER_WITHDRAWAL:
    case WITHDRAWAL_FAIL:
        qDebug() << "Paluu clicked";
        showMenu(token, accountID);
        break;
    case USER_INSERT_AMOUNT:
        qDebug() << "Return -clicked";
        qDebug() << "user token: " << token << " user accountID: " << accountID;
        showWithdrawal();
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Paluu clicked";
        offset=0;
        ui->PushText1->setStyleSheet("");
        ui->PushText5->setStyleSheet("");
        showMenu(token, accountID);
        break;
    case ATM_CHECKBALANCES:
    case AUTOMAT_VIEW_LOG:
    case ATM_ADDMONEY:
    case ATM_ADDMONEY10:
    case ATM_ADDMONEY20:
    case ATM_ADDMONEY50:
    case ATM_ADDMONEY100:
    case ATM_MONEYSENT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        qDebug() << "Paluu clicked";
        showAdminMenu(token);
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 5 , oikealla
void MainWindow::button5Clicked()
{
    switch(state) {
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 60 -clicked";
        withdraw->setAmount(QString("60"));
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Vanhemmat clicked";
        offset += 5;
        qDebug() << "offset: "<< offset;
        transactions->showTransactions(token, accountID, offset, QString("transactions"));
        break;
    case AUTOMAT_VIEW_LOG:
        qDebug() << "Vanhemmat clicked";
        offset += 5;
        qDebug() << "offset: "<< offset;
        viewlog->requestEvents(token,automatID,offset);
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 6 , oikealla
void MainWindow::button6Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM set limit -clicked";
        setlimits->requestLimit(automatID);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 80 clicked";
        withdraw->setAmount(QString("80"));
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY10:
    case ATM_ADDMONEY20:
    case ATM_ADDMONEY100:
        qDebug() << "Add Money 50 -clicked";
        showAddMoney50();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 7 , oikealla
void MainWindow::button7Clicked()
{
    switch(state) {
    case USER_WITHDRAWAL:
        qDebug() << "Insert amount clicked";
        showInsertAmount();
        break;
    case ATM_ADDMONEY:
    case ATM_ADDMONEY10:
    case ATM_ADDMONEY20:
    case ATM_ADDMONEY50:
        qDebug() << "Add Money 100 -clicked";
        showAddMoney100();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// Sivu painike numero 8 , oikealla (useimmin meillä "keskeytä")
void MainWindow::button8Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("credit");
        qDebug() << "credit clicked";
        break;
    case ADMIN_MENU:
    case USER_MENU:
    case USER_WITHDRAWAL:
    case USER_TRANSACTIONS:
    case USER_BALANCE:
    case ATM_CHECKBALANCES:
    case USER_INSERT_AMOUNT:
    case AUTOMAT_VIEW_LOG:
    case ATM_ADDMONEY:
    case ATM_ADDMONEY10:
    case ATM_ADDMONEY20:
    case ATM_ADDMONEY50:
    case ATM_ADDMONEY100:
    case ATM_MONEYSENT:
    case AUTOMAT_SET_MAX_WITHDRAWAL:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}
