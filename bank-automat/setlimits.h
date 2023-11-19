#ifndef SETLIMITS_H
#define SETLIMITS_H

#include <QObject>
#include <QWidget>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>
#include <QPushButton>
#include <QTimer>
#include <QByteArray>

class SetLimits
{
    Q_OBJECT
public:
    SetLimits();
signals:
    void automatSetLimits();
};

#endif // SETLIMITS_H
