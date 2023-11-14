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

    ID = "";
    pin = "";
    cardType = "";
    loginView = new Login(this);
    int x = (this->width() - loginView->width()) / 2;
    int y = (this->height() - loginView->height()) / 28;
    loginView->move(x,y);
    loginView->hide();
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

void MainWindow::handleResponse(QNetworkReply *reply)
{

    if (reply->error() == QNetworkReply::NoError) {
        // Successful response
        QByteArray responseData = reply->readAll();
        // Process responseData as needed
        if(state == 0) {
            if(responseData == "false") {
                ui->Title->setText(QString("Korttia ei tunnistettu"));
            }
            else {
                state = 1;
                ui->Title->setText(QString("Kortti tunnistettu"));
                ui->SecondTitle->setText(QString("Syötä pin"));
                ui->Content->clear();
                cardType = QString(responseData);
            }
        }
        else if(state == 1) {
            if(responseData.length()>20) {
                ui->Title->setText(QString("Kirjautuminen ok"));
            }
            else {
                ui->Title->setText(QString("Väärä pin koodi"));
            }
        }
    } else {
        // Handle the error
        qDebug() << "Network request failed:" << reply->errorString();
    }
    // Clean up the reply
    reply->deleteLater();

    /*
    if (reply->error() == QNetworkReply::NoError) {
        // Successful response
        QByteArray responseData = reply->readAll();
        // Process responseData as needed
        QString responseString(responseData);

        if (state == INIT) {

        }
        if (state == CARD_FAIL) {
            if (responseString == "false") {
                ui->Title->setText(QString("Korttia ei tunnistettu"));
            } else {
                state = CARD_OK;
                ui->Title->setText(QString("Kortti tunnistettu"));
                ui->SecondTitle->setText(QString("Syötä pin"));
                ui->Content->clear();
                cardType = responseString;
            }
        } else if (state == LOGIN_OK) {
            ui->Title->setText(QString("Kirjautuminen onnistui"));
            state = USER_MAIN;
            // sekä ADMIN_MAIN siirtymät, miten
        } else {
            ui->Title->setText(QString("Väärä PIN-koodi, yritä uudelleen"));
        }*/

        // Yrityskerrat täynnä
        // Siirtymät mm.
        // ADMIN_MAIN : AUTOMAT_ADD_MONEY, AUTOMAT_SET_MAX_WITHDRAWAL, AUTOMAT_VIEW_LOG
        // USER_MAIN : USER_WITHDRAWAL / USER_TRANSACTIONS / USER_BALANCE
        // CREDIT _ DEBIT tarkastukset / SELECT_ACCOUNT
        // AUTOMAT balanssit, tapahtumat, kyselyt taustalla
        // LOGOUT
        //

    /*
        if(state == USER_MAIN) {
            ui->Title->setText(QString("Tervetuloa Käyttäjä"));
        } else if(state == ADMIN_MAIN) {
            ui->Title->setText(QString("Tervetuloa Admin"));
        }

        else {
            // Handle the error
            qDebug() << "Network request failed:" << reply->errorString();
        }
        // Clean up the reply
        reply->deleteLater();
    }*/
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

void MainWindow::OK()
{

}

void MainWindow::STOP()
{

}

void MainWindow::SET()
{

}

void MainWindow::RESET()
{

}

void MainWindow::clickedGREEN()
{
    qDebug()<<"Green button clicked";
    if(state == 0) {
        requestID();
    }
    else if(state == 1) {
        requestLogin();
    }
}

void MainWindow::clickedYELLOW()
{

}

void MainWindow::clickedGREY()
{

}

void MainWindow::clickedRED()
{

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
    connect(ui->GREEN, SIGNAL(clicked()),this, SLOT(clickedGREEN()));
    connect(manager, &QNetworkAccessManager::finished, this,&MainWindow::handleResponse);
}

void MainWindow::requestID()
{
    qDebug()<<"Requesting card with ID";
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/card/"+ID));
    reply = manager->get(request);
}

void MainWindow::requestLogin()
{
    qDebug()<<"Requesting login";
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",ID);
    body.insert("pin",pin);
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
}

Login *MainWindow::getLoginView() const
{
    return loginView;
}
