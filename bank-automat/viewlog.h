#ifndef VIEWLOG_H
#define VIEWLOG_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>


class ViewLog
{
    Q_OBJECT
public:
    ViewLog();
signals:
    void automatLog();
};

#endif // VIEWLOG_H
