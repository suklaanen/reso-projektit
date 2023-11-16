#ifndef LOGIN_H
#define LOGIN_H
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>


namespace Ui {
class Login;
}

class Login : public QWidget
{
    Q_OBJECT

public:
    explicit Login(QWidget *parent = nullptr);
    ~Login();
    bool checkPinOk(const QString& enteredPIN);
public slots:
    void setCardID(QString);
    void setPIN(QString);
    void handleCard();
    void handlePin();
    void handleAttempts();
    void handleAddedAttempt();

 signals:
    void loginFail();
    void loginOkUser(QString token);
    void cardFail();
    void cardLocked();
    void cardOk(QString cardType);
    void cardOkSelectType();
    void loginOkAdmin(QString token);
    void pinOk();
    //void pinFail();
    void pinAttempts();

private:
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString cardID;
    QString pin;
    QString cardType;
    void requestCardID();
    void requestLogin();
    void checkPinAttempts();
    void addAttempt();
    QTimer *loginTimer;
    bool pin_attempted;
};

#endif // LOGIN_H
