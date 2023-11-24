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
    ui->statusbar->showMessage("© OAMK Tietotekniikan opiskelijat - 11/2023");
    state = SELECT_CARD;
    showMapView();

    login = new Login (this);
    showLogin();    
    balance = new CheckBalance(this);
    transactions = new Transactions(this);
    withdraw = new Withdraw(this);
    atmBalances = new AddMoney(this);
    viewlog = new ViewLog(this);
    //addmoney = new AddMoney(this);
    setlimits = new SetLimits(this);

    timer = new QTimer(this);
    timer->setSingleShot(true);
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    token = "";
    offset = 0;
    automatID = "";
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

// ** Käsittelijöitä **

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
    ui->GREEN->setDisabled(false);
    ui->Content->setStyleSheet("color: #ffffff");
    ui->PushText2->setStyleSheet("color: #ffffff");
    ui->PushText3->setStyleSheet("color: #ffffff");
    ui->PushText6->setStyleSheet("color: #ffffff");
    ui->PushText7->setStyleSheet("color: #ffffff");
    ui->pushButton1->setDisabled(true);
    ui->pushButton2->setDisabled(true);
    ui->pushButton3->setDisabled(true);
    ui->pushButton4->setDisabled(true);
    ui->pushButton5->setDisabled(true);
    ui->pushButton6->setDisabled(true);
    ui->pushButton7->setDisabled(true);
    ui->pushButton8->setDisabled(true);
}

void MainWindow::checkAtmLimit()
{
    if(ui->Content->text().toInt() > atmMaxWithdrawal) {
        ui->Content->setStyleSheet("color: #FF0000");
        ui->GREEN->setDisabled(true);
        ui->SecondTitle->setText(QString("Summa ylittää automaatin nostorajan ("+QString::number(atmMaxWithdrawal)+"€)"));
    }
    else {
        ui->Content->setStyleSheet("color: #FFFFFF");
        ui->GREEN->setDisabled(false);
        ui->SecondTitle->clear();
    }
}

// Connectit käsittelee saadun signaalin yhteyden tiettyyn slottiin
// l. Signaalista siirtymä Slottiin (esim. showJokinTila)
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
    connect(viewlog, SIGNAL(LogReady()), this, SLOT(showATMEvents()));
    connect(ui->atm1, SIGNAL(clicked()), this, SLOT(atm1Clicked()));
    connect(ui->atm2, SIGNAL(clicked()), this, SLOT(atm2Clicked()));
    connect(ui->atm3, SIGNAL(clicked()), this, SLOT(atm3Clicked()));
    connect(ui->atm4, SIGNAL(clicked()), this, SLOT(atm4Clicked()));
    connect(transactions, SIGNAL(balanceTransReady()), this, SLOT(takesBalanceTransactions()));
    connect(atmBalances, SIGNAL(atmInsertValuesOk(QString)),this, SLOT(showAddedMoney(QString)));
    //connect(atmBalances, SIGNAL(atmAddedMoneyOk()),this, SLOT(showAddedMoney(QString)));
    connect(setlimits, SIGNAL(atmLimitReady()), this, SLOT(showATMSetLimit()));
}
