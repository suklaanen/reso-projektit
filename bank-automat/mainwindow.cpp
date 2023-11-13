#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
    manager = new QNetworkAccessManager(this);
    reply = nullptr;
    connectSlots();
    state = 0;
    ID = "";
    pin = "";
    cardType = "";
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
}

void MainWindow::numberClickedHandler()
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

void MainWindow::okClickedHandler()
{
    if(state == 0) {
        requestID();
    }
    else if(state == 1) {
        requestLogin();
    }
}

void MainWindow::connectSlots()
{
    for(int i = 0; i <= 9; i++) {
        QString btnName = "N" + QString::number(i);
        QPushButton * btn = this->findChild<QPushButton*>(btnName);
        if(btn) {
            connect(btn, SIGNAL(clicked()),this, SLOT(numberClickedHandler()));
        }
    }
    connect(ui->GREEN, SIGNAL(clicked()),this, SLOT(okClickedHandler()));
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

