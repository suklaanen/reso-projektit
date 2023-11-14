#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

    enum State {
        INIT,
        SELECT_USER,
        SELECT_ADMIN,
        CARD_OK,
        LOGIN_OK,
        USER_MAIN,
        ADMIN_MAIN,
        USER_LOGIN,
        ADMIN_LOGIN,
        WITHDRAW,
        CONFIRM_WITHDRAW,
        VIEW_TRANSACTIONS,
        VIEW_BALANCE,
        ADD_MONEY,
        CONFIRM_ADD_MONEY,
        VIEW_LOG
    };

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

public slots:
    void handleResponse(QNetworkReply* reply);
    void userRequests(/*const std::string& event*/);
    void clickedNumberHandler();
    void clickedGREEN();
    void clickedYELLOW();
    void clickedGREY();
    void clickedRED();
    void OK();
    void STOP();
    void SET();
    void RESET();

private:
    Ui::MainWindow *ui;
    QNetworkReply * reply;
    QNetworkAccessManager *manager;
    QString ID;
    QString pin;
    void connectSlots();
    QString cardType;
    void requestID();
    void requestLogin();
    State state;
    void transition(State next_state);

};
#endif // MAINWINDOW_H
