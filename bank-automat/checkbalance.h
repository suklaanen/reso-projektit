#ifndef CHECKBALANCE_H
#define CHECKBALANCE_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>
class CheckBalance : public QObject
{
    Q_OBJECT
public:
    explicit CheckBalance(QObject *parent = nullptr);
    ~CheckBalance();

public slots:
    void showBalance();
    void showFiveLastEvent();

signals:

private:
    QString balanceData;
    void requestAccount();
    void requestEvents();
    void requestBalance();

};

#endif // CHECKBALANCE_H
