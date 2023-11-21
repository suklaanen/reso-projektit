#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QTimer>
#include <login.h>
#include "transactions.h"
#include "checkbalance.h"
#include "withdraw.h"
#include "addmoney.h"
//#include "setlimits.h"
//#include "viewlog.h"

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
        AUTOMAT_ADD_MONEY,
        ATM_CHECKBALANCES,
        AUTOMAT_CHECK_MAX,
        AUTOMAT_SET_MAX_WITHDRAWAL,
        AUTOMAT_VIEW_LOG,
        CONFIRM,
        LOGOUT
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
    void showUserBalance(QString balance);
    // ehkä ylimäärä void showBalance();
    void showWithdrawal();
    void showInsertAmount();
    void showTransactions();
    void showATMEvents();
    void showAtmBalances();
    void showAddMoney();
    void showATMSetLimit();
    void showATMCurrentLimits();
    void showWithdrawFailure(QString reason);
    void showWithdrawOk(QString amount);
    void handleTimeout();
    void handleAtmLimit(QString limit);
signals:

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
    AddMoney * atmBalances;
    QString token;
    void clearScreen();
    void checkAtmLimit();
    int offset;
    State state;
    QString saldo;
    QString atm;
    QString automatID;
    QTimer * timer;
    int atmMaxWithdrawal;
};
#endif // MAINWINDOW_H
