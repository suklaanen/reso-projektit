#ifndef LOGIN_H
#define LOGIN_H
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>

namespace Ui {
class Login;
}

class Login : public QWidget
{
    Q_OBJECT

public:
    explicit Login(QWidget *parent = nullptr);
    ~Login();
public slots:
    void setCardID(QString);
    void setPIN(QString);
    void handleResponse(QNetworkReply* reply);
    void handleCard();
    void handlePin();
signals:
    void loginOk(); // kytke mainissa tekstikentät oikein
    void loginFail();
    void cardFail(); // kytke mainissa tekstikentät oikein
    void cardOk(QString cardType); // kytkennät mainiin, mm. clear ja tekstit

private:
    //void getParentPointer();
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
};

#endif // LOGIN_H
