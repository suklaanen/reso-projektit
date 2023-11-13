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

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
public slots:
    void handleResponse(QNetworkReply* reply);
    void numberClickedHandler();
    void okClickedHandler();
private:
    Ui::MainWindow *ui;
    QNetworkReply * reply;
    QNetworkAccessManager *manager;
    QString ID;
    QString pin;
    void connectSlots();
    int state;
    QString cardType;
    void requestID();
    void requestLogin();
};
#endif // MAINWINDOW_H
