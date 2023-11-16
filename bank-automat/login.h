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

 signals:
    void loginFail();
    void loginOk();
    void cardFail();
    void cardLocked();
    void cardOk(QString cardType);
    void cardOkSelectType();
    void cardOkAdmin();
    void pinOk();
    void pinFail();
    void pinAttempts();

private:
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString cardID;
    QString pin;
    QString cardType;
    void requestCardID();
    void requestLogin();
    int state;
    bool active;
    void activate(bool on_off);
    QTimer *loginTimer;
};

#endif // LOGIN_H
