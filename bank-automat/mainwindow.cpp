#include "mainwindow.h"
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

    state = INIT;

    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    connectSlots();
    ID = "";
    pin = "";
    cardType = "";

    connect(ui->GREEN, SIGNAL(clicked(bool)), this, SLOT(OK()));
    connect(ui->RED, SIGNAL(clicked(bool)), this, SLOT(STOP()));
    connect(ui->GREY, SIGNAL(clicked(bool)), this, SLOT(SET()));
    connect(ui->YELLOW, SIGNAL(clicked(bool)), this, SLOT(RESET()));

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
        QString responseString(responseData);

        if (state == INIT) {
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
        }

        // Yrityskerrat täynnä
        // Siirtymät mm.
        // ADMIN_MAIN : SET_MONEY / SET_MAX_WITHDRAWAL / VIEW_EVENTLOG
        // USER_MAIN : USER_WITHDRAWAL / USER_EVENTS / USER_BALANCE
        // CREDIT _ DEBIT tarkastukset / SELECT_ACCOUNT
        // AUTOMAT balanssit, tapahtumat, kyselyt taustalla
        // LOGOUT
        //

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
    }
}

void MainWindow::clickedNumberHandler()
{
    QPushButton * btn = qobject_cast<QPushButton*>(sender());
    QString name = btn->objectName();

    if(state == 0) {
        ID.append(name.last(1));
        ui->Content->setText(ID);
    }
    else if(state == 1) {
        pin.append(name.last(1));
        ui->Content->setText(pin);
    }
}

void MainWindow::transition(State next_state)
{
    state = next_state;

    if (state == USER_MAIN) {
        ui->Title->setText("Tervetuloa Käyttäjä");
    } else if (state == ADMIN_MAIN) {
        ui->Title->setText("Tervetuloa Admin");
    }

}

void MainWindow::userRequests(/*const std::string& event*/)
{

    if(state == 0) {
        requestID();
    }
    else if(state == 1) {
        requestLogin();
    }

    /*
     * Vähän pohdin tämän sijoittelua
    if (state == INIT) {
        if (event == "VALITSE_KAYTTAJA") {
            transition(SELECT_USER);
        } else if (event == "VALITSE_ADMIN") {
            transition(SELECT_ADMIN);
        }
    } else if (state == SELECT_USER) {
        if (event == "KIRJAUDU") {
            transition(USER_LOGIN);
        }
    } else if (state == SELECT_ADMIN) {
        if (event == "KIRJAUDU") {
            transition(ADMIN_LOGIN);
        }
    }*/

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
    QNetworkRequest request;
    request.setUrl(QUrl("http://localhost:3000/card/"+ID));
    reply = manager->get(request);
}

void MainWindow::requestLogin()
{
    QNetworkRequest request;
    QJsonObject body;
    body.insert("id_card",ID);
    body.insert("pin",pin);
    request.setUrl(QUrl("http://localhost:3000/login"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    reply = manager->post(request, QJsonDocument(body).toJson());
}

