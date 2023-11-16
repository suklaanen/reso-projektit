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

    login = new Login (this);
    showLogin();

    balance = new CheckBalance(this);
    transactions = new Transactions(this);
    withdraw = new Withdraw(this);

    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    token = "";
    offset=5;
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

// Tämä käsittelee painikkeiden klikkaamisen
void MainWindow::clickedNumberHandler()
{
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
    } else {
        ui->Content->setEchoMode(QLineEdit::Normal);
    }
}

// Tähän tulee kaikki toiminnot, mitä vihreästä OK-napista tapahtuu Caseina
void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        login->setCardID(ui->Content->text());
        break;
    case CARD_FAIL:
        login->setCardID(ui->Content->text());
        break;
    case CARD_OK:
        login->setPIN(ui->Content->text());
        break;
    case CARD_COMBINATION:
        break;
    case LOGIN_FAIL:
        login->setPIN(ui->Content->text());
        break;
    case USER_MENU:
        break;
    case ADMIN_MENU:
        break;
    }
}

// Keltaisen painikkeen "kumita kaikki merkit" toiminto
void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
    ui->Content->clear();
}

// Harmaan painikkeen "kumita yksi merkki" toiminto
void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
}

// Punaisen painikkeen "keskeytä" STOP -toiminto, joka palaa alkutilaan
void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    state = SELECT_CARD;
    showLogin();
}

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
void MainWindow::showMenu(QString token)
{
    this->token = token;
    qDebug() << token << " user";
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

void MainWindow::button1Clicked()
{
    switch(state) {
    case USER_TRANSACTIONS:
        qDebug() << "vanhemmat clicked";
        offset=offset+5;

        break;
    }
}
void MainWindow::button2Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM Events -clicked";
        //showATMEvents();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "User Balance -clicked";
        showUserBalance();
        break;
    }
}
void MainWindow::button3Clicked()
{
    switch(state) {

    case ADMIN_MENU:
        qDebug() << "ATM balance -clicked";
       //showATMBalance();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "transactions clicked";
        clearScreen();
        break;
    }
}
void MainWindow::button4Clicked()
{
    switch(state) {
    case CARD_COMBINATION: showInputPin("debit");
        qDebug() << "debit clicked";
        break;
    case ADMIN_MENU:
        qDebug() << "ATM Add money -clicked";
        //showAddMoney();  // tai vastaavan niminen slotti
        break;
    case USER_MENU:
        qDebug() << "User Withdrawal -clicked";
        //showWithdrawal();  // tai vastaavan niminen slotti
        break;
    }
}
void MainWindow::button5Clicked()
{

}
void MainWindow::button6Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM current limit -clicked";
        //showTransactions();  // tai vastaavan niminen slotti
        break;
    }
}
void MainWindow::button7Clicked()
{
    switch(state) {
    case ADMIN_MENU:
        qDebug() << "ATM set limit -clicked";
        //showATNSetLimit();  // tai vastaavan niminen slotti
        break;
    }
}
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
    }
}

void MainWindow::showUserBalance()
{
    ui->Title->setText(QString("Saldo"));
    ui->Content->setText(QString("5. tapahtuma<br/>4. tapahtuma<br/>3.tapahtuma<br/>2.Tapahtuma<br/>1. Tapahtuma" ));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Kortin kanssa epäonnistuminen, mikä palaa tällä hetkellä showLoginiin eli alkutilaan
void MainWindow::showCardFailure()
{
    state = CARD_FAIL;
    ui->Title->setText(QString("Korttia ei löydy"));
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Kirjautumisen epäonnistuminen, esim. väärä pin ja yritä uudelleen
void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    clearScreen();
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
    ui->SecondTitle->setText(QString("Syötä pin ja yritä uudelleen"));
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
    connect(login, SIGNAL(loginOkUser(QString)),this, SLOT(showMenu(QString)));
    connect(login, SIGNAL(cardLocked()),this, SLOT(showCardLocked()));

    connect(ui->pushButton2, SIGNAL(clicked()), this, SLOT(button2Clicked()));
    connect(ui->pushButton4, SIGNAL(clicked()), this, SLOT(button4Clicked()));
    connect(ui->pushButton8, SIGNAL(clicked()), this, SLOT(button8Clicked()));
}

// Puhdistaa koko näytön, ja tämä ajetaan useimmissa tiloissa heti alussa state-julistuksen jälkeen
void MainWindow::clearScreen()
{
    ui->Content->clear();
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
