#include "mainwindow.h"
#include "ui_mainwindow.h"

// *************************************************************************************
// *** Adminin slotit
// ****** Sisältää:
// ********** showAdminMenu(QString token)
// ********** showAddMoney()
// ********** showAddMoney10()
// ********** showAddMoney20()
// ********** showAddMoney50()
// ********** showAddMoney100()
// ********** showAtmBalances()
// ********** showAddedMoney(QString amount)
// ********** showATMCurrentLimits()
// ********** showATMSetLimit()
// ********** showATMEvents()
// ********** showATMLimitSetted()
// ********** checkAtmLimit()
// ********** handleAtmLimit(QString limit)
// *************************************************************************************

// Adminin menu
void MainWindow::showAdminMenu(QString token)
{
    this->token = token;
    qDebug() << token << " admin";
    state = ADMIN_MENU;
    clearScreen();

    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton8->setDisabled(false);

    /****************************************************************
     ***** Tarvii logiikan paikkailua
     ***** atmBalancet ulos oikeille paikoilleen
                    atmBalances->getAtmBalances().at(0)
                    atmBalances->getAtmBalances().at(1)
                    atmBalances->getAtmBalances().at(2)
                    atmBalances->getAtmBalances().at(3)
     ***** Sekä Nostorajan näkymä oikeana tarvittais
    ****************************************************************/

    QString contentText =
        "\t Nostoraja : " + QString::number(atmMaxWithdrawal) + " Euroa \n" +
        "\t Setelit ja määrät : \n"
        "\t 10 €  \t" + "Kpl määrä tähän" + " \n"
        "\t 20 €  \t" + "Kpl määrä tähän" + " \n"
        "\t 50 €  \t" + "Kpl määrä tähän" + " \n"
        "\t 100 €  \t" + "Kpl määrä tähän" + " \n";

    ui->Title->setText(QString("Valitse toiminto"));
    ui->SecondTitle->setText("Automaatin ID: " + automatID);
    ui->Content2->setText(contentText);
    ui->PushText2->setText(QString("Lokitiedot"));
    ui->PushText3->setText(QString("Automaatin varat"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Muuta nostorajaa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney()
{
    clearScreen();
    state = ATM_ADDMONEY;
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Valitse lisättävät setelit"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney10()
{
    clearScreen();
    state = ATM_ADDMONEY10;
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->PushText2->setStyleSheet("color: #7777c7;");
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Syötä lisättävä määrä 10 € seteleinä"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney20()
{
    clearScreen();
    state = ATM_ADDMONEY20;
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->PushText3->setStyleSheet("color: #7777c7;");
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Syötä lisättävä määrä 20 € seteleinä"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney50()
{
    clearScreen();
    state = ATM_ADDMONEY50;
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->PushText6->setStyleSheet("color: #7777c7;");
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Syötä lisättävä määrä 50 € seteleinä"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAddMoney100()
{
    clearScreen();
    state = ATM_ADDMONEY100;
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->PushText7->setStyleSheet("color: #7777c7;");
    ui->Title->setText(QString("Lisää käyttövaroja automaattiin"));
    ui->SecondTitle->setText(QString("Syötä lisättävä määrä 100 € seteleinä"));
    ui->PushText2->setText(QString("10 €"));
    ui->PushText3->setText(QString("20 €"));
    ui->PushText6->setText(QString("50 €"));
    ui->PushText7->setText(QString("100 €"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showAtmBalances()
{
    clearScreen();
    state = ATM_CHECKBALANCES;

    ui->Title->setText("Automaatin varat ");
    ui->SecondTitle->setText("Setelit ja määrät");

    QString contentText = "\t\t10 € \t=\t" + atmBalances->getAtmBalances().at(0) + "\n" +
    "\t\t20 € \t=\t" + atmBalances->getAtmBalances().at(1) + "\n" +
    "\t\t50 € \t=\t" + atmBalances->getAtmBalances().at(2) + "\n" +
    "\t\t100 € \t=\t" + atmBalances->getAtmBalances().at(3);

    ui->Content2->setText(contentText);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showAddedMoney(QString amount)
{
    QString banknote;
    switch (state) {
    case ATM_ADDMONEY10:
        banknote = "10";
        break;
    case ATM_ADDMONEY20:
        banknote = "20";
        break;
    case ATM_ADDMONEY50:
        banknote = "50";
        break;
    case ATM_ADDMONEY100:
        banknote = "100";
        break;
    default:
        break;
    }

    clearScreen();
    state = ATM_MONEYSENT;

    ui->Title->setText("Varoja lisätty");

        QString contentText = "Käyttövaroja " + banknote + " € lisätty " + amount + " (kpl) setelin verran";

    ui->Content2->setText(contentText);
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMCurrentLimits()
{

}


void MainWindow::showATMSetLimit()
{
    clearScreen();
    state = AUTOMAT_SET_MAX_WITHDRAWAL;
    ui->Title->setText("Nykyinen nostoraja: "+setlimits->getATMLimit()+" euroa.");
    ui->SecondTitle->setText("Syötä uusi nostoraja");
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);

}

void MainWindow::showATMEvents()
{
    clearScreen();
    state = AUTOMAT_VIEW_LOG;

    if (offset == 0) {
        ui->pushButton1->setDisabled(true);
        ui->PushText1->setStyleSheet("color: #7777c7;");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    } else if (offset != 0 && viewlog->maxEvents() < offset+5) {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(true);
        ui->PushText5->setStyleSheet("color: #7777c7;");
    } else {
        ui->pushButton1->setDisabled(false);
        ui->PushText1->setStyleSheet("");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    }

    ui->Title->setText("Automaatin tapahtumat");
    ui->SecondTitle->setText("Ajankohta | Tapahtuma | Summa (€)");
        for (int i = 0; i < viewlog->getEvents().size(); i++)
        {
            ui->Content2->setText(ui->Content2->text()+viewlog->getEvents().at(i));
        }

        if (offset != 0 && viewlog->maxEvents() < offset + 5) {
            ui->Content2->setText(ui->Content2->text() + "\tEi vanhempia tapahtumia!\n");
        }

        ui->PushText1->setText(QString("Uudemmat"));
        ui->PushText5->setText(QString("Vanhemmat"));
        ui->PushText4->setText(QString("Palaa takaisin"));
        ui->PushText8->setText(QString("Keskeytä"));
        ui->pushButton4->setDisabled(false);
        ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMLimitSetted()
{
        clearScreen();
        state = AUTOMAT_SET_MAX_WITHDRAWAL;
        ui->Title->setText("Uudeksi nostorajaksi asetettu "+setlimits->getATMLimit()+" euroa.");
        ui->PushText4->setText(QString("Palaa takaisin"));
        ui->PushText8->setText(QString("Keskeytä"));
        ui->pushButton4->setDisabled(false);
        ui->pushButton8->setDisabled(false);
}

void MainWindow::checkAtmLimit()
{
        if(ui->Content->text().toInt() > atmMaxWithdrawal) {
            ui->Content->setStyleSheet("color: #FF0000");
            ui->GREEN->setDisabled(true);
            ui->SecondTitle->setText(QString("Summa ylittää automaatin nostorajan ("+QString::number(atmMaxWithdrawal)+"€)"));
        }
        else {
            ui->Content->setStyleSheet("color: #FFFFFF");
            ui->GREEN->setDisabled(false);
            ui->SecondTitle->clear();
        }
}

void MainWindow::handleAtmLimit(QString limit)
{
        this->atmMaxWithdrawal = limit.toInt();
        qDebug() << "Atm " << this->automatID << " maxwithdrawal is " << this->atmMaxWithdrawal;
}
