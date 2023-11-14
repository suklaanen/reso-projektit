#include "mainwindow.h"
#include "login.h"
#include "ui_mainwindow.h"
#include <iostream>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    //QState * start
    //QState * inputCard
    //QState * inputPin

    ui->setupUi(this);

    ui->Title->setText("Kirjaudu sisään");
    ui->Title->setAlignment(Qt::AlignCenter);
    ui->SecondTitle->setText(QString("Syötä kortin ID"));

    state = 0;

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

    if(state == 0) {
        ID.append(name.last(1));
        ui->Content->setText(ID);
        //state = CARD_OK;
    }
    else if(state == 1) {
        pin.append(name.last(1));
        ui->Content->setText(pin);
    }
}

void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";
}

void MainWindow::clickedYELLOW()
{
    qDebug()<<"Yellow button clicked";
}

void MainWindow::clickedGREY()
{
    qDebug()<<"Grey button clicked";
}

void MainWindow::clickedRED()
{
    qDebug()<<"Red button clicked";
    state = 0;
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
    connect(manager, &QNetworkAccessManager::finished, this,&MainWindow::handleResponse);
}

Login *MainWindow::getLoginView() const
{
    return loginView;
}
