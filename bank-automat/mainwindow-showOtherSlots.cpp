#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// *** Muut slotit
// ****** Sisältää:
// ********** showMapView()
// **********
// **********
// **********
// **********
// **********
// **********
// *************************************************************************************

// Automaatin valinta kartalta
void MainWindow::showMapView()
{
    state = MAP_VIEW;

    ui->Title2->setText("Valitse Bankki-automaatti kartalta");
    ui->atm1->setDisabled(false);
    ui->atm2->setDisabled(false);
    ui->atm3->setDisabled(false);
    ui->atm4->setDisabled(false);
}
