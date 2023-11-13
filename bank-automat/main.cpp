#include "mainwindow.h"

#include <QApplication>
#include <QFile>
#include <QDebug>
#include <QDir>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QDir::setCurrent("ABSOLUUTTINENPOLKUTÄHÄN/group_1/bank-automat");

    QFile styleFile("styles/bankstyle.qss");

    qDebug() << "Current working directory: " << QDir::currentPath();
    if (styleFile.open(QFile::ReadOnly | QFile::Text)) {
        QString style = QLatin1String(styleFile.readAll());
        a.setStyleSheet(style);
        styleFile.close();
    } else {
        qDebug() << "Failed to open a stylesheet file.";
    }

    MainWindow w;
    w.show();
    return a.exec();
}
