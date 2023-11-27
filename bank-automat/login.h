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
    void setCardID(const QString &inputCardID, const QString &automatID);
    void setPIN(const QString &inputPin,const QString &cardType);
    QString getAccountID();
    QString getToken();
public slots:
    void handleCard();
    void handlePin();
    void handleAttempts();
    void handleAddedAttempt();
    void handleClearAttempts();
    void handleGetAccountID();

 signals:
    void loginFail();
    void loginOkUser(QString token, QString accountID);
    void cardFail();
    void cardLocked();
    void cardOk(QString cardType);
    void cardOkSelectType();
    void loginOkAdmin(QString token);

private:
    QNetworkAccessManager *manager;
    QNetworkReply *reply;
    QString cardID;
    QString pin;
    QString cardType;
    QString token;
    QString accountID;
    QString automatID;
    void requestCardID();
    void requestLogin();
    void checkPinAttempts();
    void clearPinAttempts();
    void requestAccountID();
    void addAttempt();
    bool pin_attempted;
};

#endif // LOGIN_H
