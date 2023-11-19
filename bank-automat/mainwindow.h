#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <login.h>
#include "transactions.h"
#include "checkbalance.h"
#include "withdraw.h"

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
        PIN_ATTEMPT_1,
        PIN_ATTEMPT_2,
        PIN_ATTEMPT_3,
        CARD_LOCKED,
        SELECT_ACCOUNT,
        CARD_COMBINATION,
        CARD_MANYDEBITS,
        CARD_ADMIN,
        CARD_CREDIT,
        CARD_DEBIT,
        SELECT_DEBIT,
        SELECT_CREDIT,
        SELECT_ADMIN,
        USER_LOGIN,
        ADMIN_LOGIN,
        USER_MENU,
        ADMIN_MENU,
        USER_TRANSACTIONS,
        USER_BALANCE,
        USER_WITHDRAWAL,
        USER_INSERT_AMOUNT,
        AUTOMAT_ADD_MONEY,
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
    void showUserBalance(const QString& saldo);
    void showWithdrawal();
    void showInsertAmount();
    void showTransactions();
    void handleTransactionsReady(const QString &data);
    void handleBalanceReady(const QString &data);
signals:
    // transaction signaalien siirto >> transactions.h
    // balance signaalien siirto >> checkbalance.h
    // withdrawal signaalien siirto >> withdraw.h
    void accountCombined();
    void accountDebit();
    void accountManyDebits();
    void accountCredit();
    void accountAdmin();
    void userMain();

    void transactionsBackward();
    void transactionsForward();
    void userBalance();
    void userWithdrawal();
    void withdrawalOk();
    void withdrawalFail();
    void returnWithdrawal();
    void returnUserMain();
    void automatAddMoney();
    void automatLog();
    void automatSetMax();
    void returnAdminMain();
    void logout();
    void timeout();

private:
    Ui::MainWindow *ui;
    QNetworkReply * reply;
    QNetworkAccessManager *manager;
    QString ID;
    QString pin;
    void connectSlots();
    QString cardType;
    QString accountID;

    int state;
    Login * login;
    CheckBalance * balance;
    Withdraw * withdraw;
    Transactions * transactions;
    QString token;
    void clearScreen();

    int offset;
    QString saldo;
};
#endif // MAINWINDOW_H
