#include "mainwindow.h"
#include "login.h"
#include "ui_mainwindow.h"
#include <iostream>

// Tämä setuppaa alkutilan
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)

    {
        ui->setupUi(this);

        state = SELECT_CARD;
        showMapView();

        login = new Login (this);
        //login->hide();
        showLogin();

        balance = new CheckBalance(this);
        transactions = new Transactions(this);
        withdraw = new Withdraw(this);
        atmBalances = new AddMoney(this);
        //viewlog = new ViewLog(this);
        //addmoney = new AddMoney(this);
        //setlimits = new SetLimits(this);

        timer = new QTimer(this);
        timer->setSingleShot(true);
        manager = new QNetworkAccessManager(this);
        reply = nullptr;
        token = "";
        offset = 0;
        //automatID = "1";
        connectSlots();

        ui->RED->setDisabled(false);
        ui->YELLOW->setDisabled(false);
        ui->GREY->setDisabled(false);
        ui->GREEN->setDisabled(false);
}

MainWindow::~MainWindow()
{
    delete ui;
}

// ------------------------------------------------------------------------------------------
// Käsittelyt tässä osiossa, painikkeiden handleri, ruudun tyhjentäminen sekä connectit:
// ** clickedNumberHandler **
// ** clearScreen **
// ** connectSlots **
// ------------------------------------------------------------------------------------------

// Tämä käsittelee painikkeiden klikkaamisen
void MainWindow::clickedNumberHandler()
{
    if(state == SELECT_CARD || state == CARD_OK || state == CARD_FAIL || state == LOGIN_FAIL || state == USER_INSERT_AMOUNT) {
        QPushButton * btn = qobject_cast<QPushButton*>(sender());
        QString name = btn->objectName();
        qDebug()<< name << " -button clicked";

        QString content = ui->Content->text();

        if (content.length() < 4) {
            content.append(name.last(1));
            ui->Content->setText(content);
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

// Puhdistaa koko näytön, ja tämä ajetaan useimmissa tiloissa heti alussa state-julistuksen jälkeen
void MainWindow::clearScreen()
{
    ui->Content->clear();
    ui->Content2->clear();
    ui->Content2->setAlignment(Qt::AlignLeft);
    ui->Title->clear();
    ui->SecondTitle->clear();
    ui->PushText1->clear();
    ui->PushText2->clear();
    ui->PushText3->clear();
    ui->PushText4->clear();
    ui->PushText5->clear();
    ui->PushText6->clear();
    ui->PushText7->clear();
    ui->PushText8->clear();
    ui->pushButton1->setDisabled(true);
    ui->pushButton2->setDisabled(true);
    ui->pushButton3->setDisabled(true);
    ui->pushButton4->setDisabled(true);
    ui->pushButton5->setDisabled(true);
    ui->pushButton6->setDisabled(true);
    ui->pushButton7->setDisabled(true);
    ui->pushButton8->setDisabled(true);
}


// Connectit käsittelee saadun signaalin yhteyden tiettyyn slottiin, mikä tekee sen, että
// SIGNAALISTA siirrytään SLOTTIIN (showJokinTila, joita useita tuossa yläpuolella)
void MainWindow::connectSlots()
{
    for(int i = 0; i <= 9; i++) {
        QString btnName = "N" + QString::number(i);
        QPushButton * btn = this->findChild<QPushButton*>(btnName);
        if(btn) {
            connect(btn, SIGNAL(clicked()),this, SLOT(clickedNumberHandler()));
        }
    }
    connect(ui->RED, SIGNAL(clicked()),this, SLOT(clickedRED()));
    connect(ui->YELLOW, SIGNAL(clicked()),this, SLOT(clickedYELLOW()));
    connect(ui->GREY, SIGNAL(clicked()),this, SLOT(clickedGREY()));
    connect(ui->GREEN, SIGNAL(clicked()),this, SLOT(clickedGREEN()));
    connect(ui->pushButton1, SIGNAL(clicked()), this, SLOT(button1Clicked()));
    connect(ui->pushButton2, SIGNAL(clicked()), this, SLOT(button2Clicked()));
    connect(ui->pushButton3, SIGNAL(clicked()), this, SLOT(button3Clicked()));
    connect(ui->pushButton4, SIGNAL(clicked()), this, SLOT(button4Clicked()));
    connect(ui->pushButton5, SIGNAL(clicked()), this, SLOT(button5Clicked()));
    connect(ui->pushButton6, SIGNAL(clicked()), this, SLOT(button6Clicked()));
    connect(ui->pushButton7, SIGNAL(clicked()), this, SLOT(button7Clicked()));
    connect(ui->pushButton8, SIGNAL(clicked()), this, SLOT(button8Clicked()));
    connect(login, SIGNAL(cardFail()), this, SLOT(showCardFailure()));
    connect(login, SIGNAL(cardOk(QString)), this, SLOT(showInputPin(QString)));
    connect(login, SIGNAL(cardOkSelectType()),this, SLOT(selectDebitCredit()));
    connect(login, SIGNAL(loginOkAdmin(QString)),this, SLOT(showAdminMenu(QString)));
    connect(login, SIGNAL(loginFail()),this, SLOT(showLoginFailure()));
    connect(login, SIGNAL(loginOkUser(QString,QString)),this, SLOT(showMenu(QString,QString)));
    connect(login, SIGNAL(cardLocked()),this, SLOT(showCardLocked()));
    connect(transactions, SIGNAL(transactionsReady()), this, SLOT(showTransactions()));
    connect(timer, SIGNAL(timeout()), this, SLOT(handleTimeout()));
    connect(balance, SIGNAL(balanceReady(QString)),this, SLOT(showUserBalance(QString)));
    connect(withdraw, SIGNAL(atmLimitReady(QString)),this, SLOT(handleAtmLimit(QString)));
    connect(withdraw, SIGNAL(withdrawFailure(QString)),this, SLOT(showWithdrawFailure(QString)));
    connect(withdraw, SIGNAL(withdrawalOk(QString)),this, SLOT(showWithdrawOk(QString)));
    connect(atmBalances, SIGNAL(atmBalancesReady()),this, SLOT(showAtmBalances()));
    connect(ui->atm1, SIGNAL(clicked()), this, SLOT(atm1Clicked()));
    connect(ui->atm2, SIGNAL(clicked()), this, SLOT(atm2Clicked()));
    connect(ui->atm3, SIGNAL(clicked()), this, SLOT(atm3Clicked()));
    connect(ui->atm4, SIGNAL(clicked()), this, SLOT(atm4Clicked()));
}

// *************************************************************************************
// ** Automaatin valinta kartalta ? *****************************************************
// *************************************************************************************

void MainWindow::showMapView()
{
    state = MAP_VIEW;

    ui->Title2->setText("Valitse Bankki-automaatti kartalta");
    ui->atm1->setDisabled(false);
    ui->atm2->setDisabled(false);
    ui->atm3->setDisabled(false);
    ui->atm4->setDisabled(false);
}

// -------------------------------------------------------------------------------------
// ** Painikkeet ** ja napit alkavat tästä sekä niistä etenemiset switch casella
// case NIMI:   kertoo "nykyisen" vaiheen (state) ja se ilmaistaan tiloissa alempana
// -------------------------------------------------------------------------------------


// Tähän tulee kaikki toiminnot, mitä vihreästä OK-napista tapahtuu Caseina

void MainWindow::atm1Clicked()
{
    qDebug()<<"ATM1 button clicked";
    automatID = "1";

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
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        if(ui->Content->text() != "") {
            ID = ui->Content->text();
            login->setCardID(ui->Content->text());
        }
        else {
            login->setCardID("0");
        }
        break;
    case CARD_FAIL:
        if(ui->Content->text() != "") {
            ID = ui->Content->text();
            login->setCardID(ui->Content->text());
        }
        else {
            login->setCardID("0");
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
    timer->stop();
    timer->start(10000);
}

// Harmaan painikkeen "kumita yksi merkki" toiminto
void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
    timer->stop();
    timer->start(10000);
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
        transactions->showTransactions(token, accountID, offset);
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
        showATMEvents();
        break;
    case USER_MENU:
        qDebug() << "User Balance -clicked";
        balance->displayBalance(token, accountID);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 20 clicked";
        withdraw->setAmount(QString("20"));
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
        atmBalances->checkAtmBalances(token, automatID, offset);
        break;
    case USER_MENU:
        qDebug() << "transactions clicked";
        offset = 0;
        transactions->showTransactions(token, accountID, offset);
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 40 clicked";
        withdraw->setAmount(QString("40"));
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
        qDebug() << "Return -clicked";
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
        showMenu(token, accountID);
        break;
    case WITHDRAWAL_FAIL:
        qDebug() << "Paluu clicked";
        showMenu(token, accountID);
        break;
    case ATM_CHECKBALANCES:
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
        transactions->showTransactions(token, accountID, offset);
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
        qDebug() << "ATM current limit -clicked";
        showATMCurrentLimits();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Withdraw 80 clicked";
        withdraw->setAmount(QString("80"));
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
    case ADMIN_MENU:
        qDebug() << "ATM set limit -clicked";
        showATMSetLimit();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Insert amount clicked";
        showInsertAmount();
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
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_MENU:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_WITHDRAWAL:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_TRANSACTIONS:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case USER_BALANCE:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    case ATM_CHECKBALANCES:
        qDebug() << "Stop session -clicked";
        showLogin();
        break;
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

// -------------------------------------------------------------------------------------------------------
// Valikoista ja painikkeista avautuvat ** Tilat ** alkavat tästä, ja kaikissa show -tunniste nimen alussa
// state = NIMI;    kussakin tilassa ilmaisee kyseisessä tilassa olevan vaiheen (state)
// clearScreen();   hyvä muistaa useimmissa sijoittaa alkuun
// -------------------------------------------------------------------------------------------------------

// Alkutila, jossa on kirjautumiskehoite
void MainWindow::showLogin()
{
    state = SELECT_CARD;

    clearScreen();
    ui->Title->setText("Kirjaudu sisään");
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Pin kortin syöttö tila, kun kortti on tunnistettu
void MainWindow::showInputPin(QString cardType)
{
    qDebug() << cardType << " selected";
    state = CARD_OK;
    this->cardType = cardType;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
}

// Valitse Debit tai Credit (ennen pinin kyselyä, jos yhdistelmäkortti)
void MainWindow::selectDebitCredit()
{
    this->cardType = "credit/debit";
    state = CARD_COMBINATION;
    clearScreen();
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse tili"));
    ui->PushText4->setText(QString("Debit"));
    ui->PushText8->setText(QString("Credit"));
}

// Käyttäjän menu (adminin menu tulee erikseen)
void MainWindow::showMenu(QString token, QString accountID)
{
    this->token = token;
    this->accountID = accountID;
    qDebug() << "user token: " << token << " user accountID: " << accountID;
    state = USER_MENU;
    clearScreen();
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Saldo"));
    ui->PushText3->setText(QString("Tapahtumat"));
    ui->PushText4->setText(QString("Nosto"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Adminin menu
void MainWindow::showAdminMenu(QString token)
{
    this->token = token;
    qDebug() << token << " admin";
    state = ADMIN_MENU;
    clearScreen();
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Lokitiedot"));
    ui->PushText3->setText(QString("Automaatin varat"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Nostoraja"));
    ui->PushText7->setText(QString("Muuta nostorajaa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showCardLocked()
{
    clearScreen();
    state = CARD_LOCKED;
    ui->Title->setText(QString("Kortti lukittu"));
    ui->SecondTitle->setText(QString("Ota yhteys pankkiin"));
}

void MainWindow::showUserBalance(QString balance)
{

    this->saldo = balance;  // Aseta saldo-muuttujan arvo
    clearScreen();
    state = USER_BALANCE;

    ui->Title->setText("Tilin saldo");
    ui->Title->setText("Tilin saldo " + this->saldo);
    ui->SecondTitle->setText("");

    /*************************************************************************
    int transactionCount = transactions->getTransactions().size();
    int startIndex = (transactionCount > 5) ? (transactionCount - 5) : 0;

    for (int i = startIndex; i < transactionCount; i++)
    {
        ui->Content2->setText(ui->Content2->text() + transactions->getTransactions().at(i));
    }
    **************************************************************************/

    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showWithdrawal()
{
    clearScreen();
    state = USER_WITHDRAWAL;
    withdraw->setInfo(token,accountID,ID,cardType);
    ui->pushButton1->setDisabled(false);
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton5->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse nostettava summa"));
    ui->PushText1->setText(QString("10"));
    ui->PushText2->setText(QString("20"));
    ui->PushText3->setText(QString("40"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText5->setText(QString("60"));
    ui->PushText6->setText(QString("80"));
    ui->PushText7->setText(QString("Muu summa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showInsertAmount()
{
    clearScreen();
    state = USER_INSERT_AMOUNT;
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Syötä nostettava summa"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Kortin kanssa epäonnistuminen, mikä palaa tällä hetkellä showLoginiin eli alkutilaan
void MainWindow::showCardFailure()
{
    state = CARD_FAIL;
    clearScreen();
    ui->Title->setText(QString("Korttia ei löydy"));
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Kirjautumisen epäonnistuminen, esim. väärä pin ja yritä uudelleen
void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
    ui->SecondTitle->setText(QString("Syötä pin ja yritä uudelleen"));
}

void MainWindow::showTransactions()
{
    clearScreen();
    state = USER_TRANSACTIONS;

    if (offset == 0) {
        ui->pushButton1->setDisabled(true);
        ui->PushText1->setStyleSheet("color: #7777c7;");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    } else if (offset != 0 && transactions->maxTransactions() < offset+5) {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(true);
        ui->PushText5->setStyleSheet("color: #7777c7;");
    } else {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    }

    ui->Title->setText("Tilitapahtumat");
    ui->SecondTitle->setText("Ajankohta | Tapahtuma | Summa (€)");
    for (int i = 0; i < transactions->getTransactions().size(); i++)
    {
        ui->Content2->setText(ui->Content2->text()+transactions->getTransactions().at(i));
    }

    if (offset != 0 && transactions->maxTransactions() < offset + 5) {
        ui->Content2->setText(ui->Content2->text() + "Ei vanhempia tapahtumia!\n");
    }

    ui->PushText1->setText(QString("Uudemmat"));
    ui->PushText5->setText(QString("Vanhemmat"));
    ui->PushText4->setText(QString("Paluu"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}


void MainWindow::showAddMoney()
{

}

void MainWindow::showAtmBalances()
{
    //qDebug() << "Pääseekö tähän asti? 2";
    clearScreen();
    state = ATM_CHECKBALANCES;

    ui->Title->setText("Automaatin varat ");
    ui->SecondTitle->setText("Setelit ja määrät");

    QString contentText = "\t\t10 € \t=\t" + atmBalances->getAtmBalances().at(0) + "\n" +
    "\t\t20 € \t=\t" + atmBalances->getAtmBalances().at(1) + "\n" +
    "\t\t50 € \t=\t" + atmBalances->getAtmBalances().at(2) + "\n" +
    "\t\t100 € \t=\t" + atmBalances->getAtmBalances().at(3);

    ui->Content2->setText(contentText);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMCurrentLimits()
{

}

void MainWindow::showWithdrawFailure(QString reason)
{
    state = WITHDRAWAL_FAIL;
    clearScreen();
    ui->Title->setText("Nosto epäonnistui");
    ui->SecondTitle->setText(reason);
    ui->PushText4->setText(QString("Paluu"));
    ui->pushButton4->setDisabled(false);
}

void MainWindow::showWithdrawOk(QString amount)
{
    state = WITHDRAWAL_OK;
    clearScreen();
    ui->Title->setText("Nosto suoritettu");
    ui->SecondTitle->setText("Nostettu "+amount+" euroa");
    timer->start(4000);
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
    default:
        // "kaikki muut enum-arvot"
        break;
    }
}

void MainWindow::handleAtmLimit(QString limit)
{
    this->atmMaxWithdrawal = limit;
    qDebug() << "Atm maxwithdrawal is " << this->atmMaxWithdrawal;
}

void MainWindow::showATMSetLimit()
{

}

void MainWindow::showATMEvents()
{

}
