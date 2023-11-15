#include "mainwindow.h"
#include "login.h"
#include "ui_mainwindow.h"
#include <iostream>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    state = SELECT_CARD;

    login = new Login (this);
    showLogin();

    manager = new QNetworkAccessManager(this);
    reply = nullptr;

    connectSlots();

    ui->pushButton1->setDisabled(true);
    ui->pushButton2->setDisabled(true);
    ui->pushButton3->setDisabled(true);
    ui->pushButton4->setDisabled(true);
    ui->pushButton5->setDisabled(true);
    ui->pushButton6->setDisabled(true);
    ui->pushButton7->setDisabled(true);
    ui->pushButton8->setDisabled(true);

    ui->RED->setDisabled(false);
    ui->YELLOW->setDisabled(false);
    ui->GREY->setDisabled(false);
    ui->GREEN->setDisabled(false);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::clickedNumberHandler()
{
    QPushButton * btn = qobject_cast<QPushButton*>(sender());
    QString name = btn->objectName();
    qDebug()<< name << " -button clicked";

    QString content = ui->Content->text();
    content.append(name.last(1));
    ui->Content->setText(content);
}

void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";

    switch (state) {
    case SELECT_CARD:
        login->setCardID(ui->Content->text());
        break;
    case CARD_FAIL:
        // tarkastus, onko kortti lukittu vai ei?
        break;
    case CARD_OK:
        login->setPIN(ui->Content->text());
        break;
    case CARD_COMBINATION:
        ui->pushButton4->setDisabled(false);
        ui->pushButton8->setDisabled(false);
        break;
    case USER_MENU:
        ui->pushButton2->setDisabled(false);
        ui->pushButton3->setDisabled(false);
        ui->pushButton7->setDisabled(false);
        break;
    // Allaolevat attemptit ehkä, eos
   /* case PIN_ATTEMPT_1:
        if (login->checkPinOk(ui->Content->text())) {
            state = USER_MENU;
        } else {
            state = PIN_ATTEMPT_2;
        }
        break;
    case PIN_ATTEMPT_2:
        if (login->checkPinOk(ui->Content->text())) {
            state = USER_MENU;
        } else {
            state = CARD_LOCKED;
        }
        break;
    case CARD_LOCKED:
        break;*/
    }
}

void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
    ui->Content->clear();
}

void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";

    QString content = ui->Content->text();
    if (content.size() > 0) {
        ui->Content->setText(content.left(content.size() -1));
    }
}

void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    state = SELECT_CARD;
    showLogin();
}

void MainWindow::showLogin()
{
    state = SELECT_CARD;
    clearScreen();
    ui->Title->setText("Kirjaudu sisään");
    ui->Title->setAlignment(Qt::AlignCenter);
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

void MainWindow::showInputPin(QString cardType)
{
    state = CARD_OK;
    this->cardType = cardType;
    clearScreen();
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
}

void MainWindow::selectDebitCredit()
{
    this->cardType = "debit/credit";
    state = CARD_COMBINATION;
    clearScreen();
    ui->Title->setText(QString("Valitse tili"));
    ui->PushText4->setText(QString("Debit"));
    ui->PushText8->setText(QString("Credit"));
}

void MainWindow::showMenu()
{
    state = USER_MENU;
    clearScreen();
    ui->PushText2->setText(QString("Saldo"));
    ui->PushText3->setText(QString("Tapahtumat"));
    ui->PushText7->setText(QString("Nosto"));
}

void MainWindow::showCardFailure()
{
    showLogin();
    // rakenne myös kortin tarkastamiseen (jos lukittu)?
}

void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
}

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
// Tänne kytkökset + virhekäsittelyt (esim jos card ei ookkaan ok tai jos pin on väärä)
    connect(login, SIGNAL(cardFail()), this, SLOT(showCardFailure()));
    connect(login, SIGNAL(cardOk(QString)), this, SLOT(showInputPin(QString)));
    connect(login, SIGNAL(cardOkSelectType()),this, SLOT(selectDebitCredit()));
// Kommentoidut toteutus pitää tehdä:
    //connect(login, SIGNAL(selectDebit()),this, SLOT(showInputPin(QString)));
    //connect(login, SIGNAL(selectCredit()),this, SLOT(showInputPin(QString)));
    connect(login, SIGNAL(loginFail()),this, SLOT(showLoginFailure()));
    connect(login, SIGNAL(loginOk()),this, SLOT(showMenu()));
}

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
}
