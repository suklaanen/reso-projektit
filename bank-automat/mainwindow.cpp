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
    setlimits = new SetLimits(this);
    adminMenu = new AdminMenuInfo(this, withdraw, atmBalances);

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

// Puhdistaa koko näytön, ja tämä ajetaan useimmissa tiloissa state:n jälkeen
void MainWindow::clearScreen()
{
    ui->Content->clear();
    ui->Content2->clear();
    ui->Content2->setAlignment(Qt::AlignLeft);
    ui->Content3->clear();
    ui->Content3->setAlignment(Qt::AlignLeft);
    ui->Content4->clear();
    ui->Content4->setAlignment(Qt::AlignLeft);
    ui->Content5->clear();
    ui->Content5->setAlignment(Qt::AlignLeft);
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

void MainWindow::disableEnableButtons(QVector<QPushButton*> btns, bool state)
{
    for(auto btn: btns) {
        btn->setDisabled(state);
    }
}
