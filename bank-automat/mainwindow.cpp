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

    //state = SELECT_CARD;
    //currentState = SELECT_CARD;

    // Luo tilat
    //State *SELECT_CARD = new State();
    //State *CARD_FAIL = new State();
    //State *LOGIN_FAIL = new State();


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
    switch (state) {
    case SELECT_CARD:
        qDebug()<<"Green button clicked";
        login->setCardID(ui->Content->text());
        break;
    case CARD_FAIL:
        // tarkastus, onko kortti lukittu vai ei?
        qDebug()<<"Green button clicked";
        state = SELECT_CARD;
        break;
    case CARD_OK:
        qDebug()<<"Green button clicked";
        //login->setPIN(ui->Content->text());
        state = PIN_ATTEMPT_1;
        break;
    case PIN_ATTEMPT_1:
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
        break;
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
    ui->Title->setText("Kirjaudu sisään");
    ui->Title->setAlignment(Qt::AlignCenter);
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
    ui->Content->clear();
}

void MainWindow::showInputPin(QString cardType)
{
    state = CARD_OK;
    this->cardType = cardType;
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
    ui->Content->clear();
}

void MainWindow::selectDebitCredit()
{
    this->cardType = "debit/credit";
    state = CARD_COMBINATION;
    ui->Title->setText(QString("Valitse tili"));
    ui->PushText4->setText(QString("debit"));
    ui->PushText8->setText(QString("credit"));
}

void MainWindow::showMenu()
{
    state = USER_MENU;
    ui->Title->clear();
    ui->PushText1->setText(QString("Tarkista saldo"));
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
    // TÄNNE kytkökset + virhekäsittelyt (esim jos card ei ookkaan ok tai jos pin on väärä)
    connect(login, SIGNAL(cardOk(QString)), this, SLOT(showInputPin(QString)));
    connect(login, SIGNAL(cardOkSelectType()),this, SLOT(selectDebitCredit()));
    connect(login, SIGNAL(loginOk()), this, SLOT(showMenu()));
    connect(login, SIGNAL(cardFail()), this, SLOT(showCardFailure()));
}
