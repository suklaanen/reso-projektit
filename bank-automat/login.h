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
    void loginOk(); // kytke mainissa tekstikentät oikein
    void loginFail();
    void cardFail(); // kytke mainissa tekstikentät oikein
    void cardLocked();
    void cardOk(QString cardType); // kytkennät mainiin, mm. clear ja tekstit
    void cardOkSelectType();
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
