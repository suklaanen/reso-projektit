#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QTimer>
#include <login.h>
#include <QMainWindow>
#include "transactions.h"
#include "checkbalance.h"
#include "withdraw.h"
#include "addmoney.h"

//#include "setlimits.h"
#include "viewlog.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

    enum State {
        SELECT_CARD,
        CARD_FAIL,
        CARD_OK,
        PIN_OK,
        LOGIN_FAIL,
        CARD_LOCKED,
        SELECT_ACCOUNT,
        CARD_COMBINATION,
        CARD_MANYDEBITS,
        CARD_ADMIN,
        SELECT_ADMIN,
        USER_MENU,
        ADMIN_MENU,
        USER_TRANSACTIONS,
        USER_BALANCE,
        USER_WITHDRAWAL,
        USER_INSERT_AMOUNT,
        WITHDRAWAL_OK,
        WITHDRAWAL_FAIL,
        ATM_ADDMONEY,
        ATM_ADDMONEY10,
        ATM_ADDMONEY20,
        ATM_ADDMONEY50,
        ATM_ADDMONEY100,
        ATM_MONEYSENT,
        ATM_CHECKBALANCES,
        AUTOMAT_CHECK_MAX,
        AUTOMAT_SET_MAX_WITHDRAWAL,
        AUTOMAT_VIEW_LOG,
        CONFIRM,
        LOGOUT,
        MAP_VIEW
    };
public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    Login *getLoginView() const;
public slots:
    void clickedNumberHandler();
    void clickedGREEN();
    void clickedYELLOW();
    void clickedGREY();
    void clickedRED();
    void showLogin();
    void showInputPin(QString cardType);
    void selectDebitCredit();
    void showMenu(QString token, QString accountID);
    void showCardFailure();
    void showLoginFailure();
    void showAdminMenu(QString token);
    void showCardLocked();
    void button1Clicked();
    void button2Clicked();
    void button3Clicked();
    void button4Clicked();
    void button5Clicked();
    void button6Clicked();
    void button7Clicked();
    void button8Clicked();
    void atm1Clicked();
    void atm2Clicked();
    void atm3Clicked();
    void atm4Clicked();
    void showUserBalance(QString balance);
    void takesBalanceTransactions();
    void showWithdrawal();
    void showInsertAmount();
    void showTransactions();
    void showATMEvents();
    void showAtmBalances();
    void showATMSetLimit();
    void showATMCurrentLimits();
    void showWithdrawFailure(QString reason);
    void showWithdrawOk(QString amount);
    void handleTimeout();
    void handleAtmLimit(QString limit);
    void showMapView();
    void showAddMoney();
    void showAddMoney10();
    void showAddMoney20();
    void showAddMoney50();
    void showAddMoney100();
    void showAddedMoney(QString amount);
private:
    Ui::MainWindow *ui;
    QNetworkReply * reply;
    QNetworkAccessManager *manager;
    QString ID;
    void connectSlots();
    QString cardType;
    QString accountID;
    Login * login;
    CheckBalance * balance;
    Withdraw * withdraw;
    Transactions * transactions;
    ViewLog * viewlog;
    AddMoney * atmBalances;
    QString token;
    void clearScreen();
    void checkAtmLimit();
    void addMoney10();
    void addMoney20();
    void addMoney50();
    void addMoney100();
    int offset;
    State state;
    QString saldo;
    QString atm;
    QString automatID;
    QTimer * timer;
    int atmMaxWithdrawal;
};
#endif // MAINWINDOW_H
