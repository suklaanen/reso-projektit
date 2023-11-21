#include "mainwindow.h"
#include "ui_mainwindow.h"

// -------------------------------------------------------------------------------------------------------
// Valikoista ja painikkeista avautuvat ** Tilat ** alkavat tästä, ja kaikissa show -tunniste nimen alussa
// state = NIMI;    kussakin tilassa ilmaisee kyseisessä tilassa olevan vaiheen (state)
// clearScreen();   hyvä muistaa useimmissa sijoittaa alkuun
// -------------------------------------------------------------------------------------------------------


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

// Alkutila, jossa on kirjautumiskehoite
void MainWindow::showLogin()
{
    state = SELECT_CARD;
    token = "";
    ID = "";
    accountID = "";
    cardType = "";
    clearScreen();
    ui->Title->setText("Kirjaudu sisään");
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Pin kortin syöttö tila, kun kortti on tunnistettu
void MainWindow::showInputPin(QString cardType)
{
    qDebug() << cardType << " selected";
    state = CARD_OK;
    this->cardType = cardType;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kortti tunnistettu"));
    ui->SecondTitle->setText(QString("Syötä pin"));
}

// Käyttäjän menu (adminin menu tulee erikseen)
void MainWindow::showMenu(QString token, QString accountID)
{
    this->token = token;
    this->accountID = accountID;
    qDebug() << "user token: " << token << " user accountID: " << accountID;
    state = USER_MENU;
    clearScreen();
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Saldo"));
    ui->PushText3->setText(QString("Tapahtumat"));
    ui->PushText4->setText(QString("Nosto"));
    ui->PushText8->setText(QString("Keskeytä"));
}

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
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse toiminto"));
    ui->PushText2->setText(QString("Lokitiedot"));
    ui->PushText3->setText(QString("Automaatin varat"));
    ui->PushText4->setText(QString("Lisää varoja"));
    ui->PushText6->setText(QString("Nostoraja"));
    ui->PushText7->setText(QString("Muuta nostorajaa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showCardLocked()
{
    clearScreen();
    state = CARD_LOCKED;
    ui->Title->setText(QString("Kortti lukittu"));
    ui->SecondTitle->setText(QString("Ota yhteys pankkiin"));
    timer->start(4000);
}

void MainWindow::showUserBalance(QString balance)
{

    this->saldo = balance;  // Aseta saldo-muuttujan arvo
    clearScreen();
    state = USER_BALANCE;
    ui->Title->setText("Tilin saldo " + this->saldo);

    ui->SecondTitle->setText("Ajankohta | Tapahtuma | Summa (€)");
    for (int i = 0; i < transactions->getTransactions().size(); i++)
        {
        ui->Content2->setText(ui->Content2->text()+transactions->getTransactions().at(i));
        }


    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showWithdrawal()
{
    clearScreen();
    state = USER_WITHDRAWAL;
    withdraw->setInfo(token,accountID,ID,cardType,automatID);
    ui->pushButton1->setDisabled(false);
    ui->pushButton2->setDisabled(false);
    ui->pushButton3->setDisabled(false);
    ui->pushButton4->setDisabled(false);
    ui->pushButton5->setDisabled(false);
    ui->pushButton6->setDisabled(false);
    ui->pushButton7->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Valitse nostettava summa"));
    ui->PushText1->setText(QString("10"));
    ui->PushText2->setText(QString("20"));
    ui->PushText3->setText(QString("40"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText5->setText(QString("60"));
    ui->PushText6->setText(QString("80"));
    ui->PushText7->setText(QString("Muu summa"));
    ui->PushText8->setText(QString("Keskeytä"));
}

void MainWindow::showInsertAmount()
{
    clearScreen();
    state = USER_INSERT_AMOUNT;
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
    ui->Title->setText(QString("Syötä nostettava summa"));
    ui->PushText4->setText(QString("Palaa takaisin"));
    ui->PushText8->setText(QString("Keskeytä"));
}

// Kortin kanssa epäonnistuminen, mikä palaa tällä hetkellä showLoginiin eli alkutilaan
void MainWindow::showCardFailure()
{
    state = CARD_FAIL;
    clearScreen();
    ui->Title->setText(QString("Korttia ei löydy"));
    ui->SecondTitle->setText(QString("Syötä kortin ID"));
}

// Kirjautumisen epäonnistuminen, esim. väärä pin ja yritä uudelleen
void MainWindow::showLoginFailure()
{
    state = LOGIN_FAIL;
    clearScreen();
    timer->start(10000);
    ui->Title->setText(QString("Kirjautuminen epäonnistui"));
    ui->SecondTitle->setText(QString("Syötä pin ja yritä uudelleen"));
}

void MainWindow::showTransactions()
{
    clearScreen();
    state = USER_TRANSACTIONS;

    if (offset == 0) {
        ui->pushButton1->setDisabled(true);
        ui->PushText1->setStyleSheet("color: #7777c7;");
        ui->pushButton5->setDisabled(false);
        ui->PushText5->setStyleSheet("");
    } else if (offset != 0 && transactions->maxTransactions() < offset+5) {
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

    ui->Title->setText("Tilitapahtumat");
    ui->SecondTitle->setText("Ajankohta | Tapahtuma | Summa (€)");
    for (int i = 0; i < transactions->getTransactions().size(); i++)
    {
        ui->Content2->setText(ui->Content2->text()+transactions->getTransactions().at(i));
    }

    if (offset != 0 && transactions->maxTransactions() < offset + 5) {
        ui->Content2->setText(ui->Content2->text() + "Ei vanhempia tapahtumia!\n");
    }

    ui->PushText1->setText(QString("Uudemmat"));
    ui->PushText5->setText(QString("Vanhemmat"));
    ui->PushText4->setText(QString("Paluu"));
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}


void MainWindow::showAddMoney()
{

}

void MainWindow::showAtmBalances()
{
    //qDebug() << "Pääseekö tähän asti? 2";
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
    ui->PushText8->setText(QString("Lopeta"));
    ui->pushButton4->setDisabled(false);
    ui->pushButton8->setDisabled(false);
}

void MainWindow::showATMCurrentLimits()
{

}

void MainWindow::showWithdrawFailure(QString reason)
{
    state = WITHDRAWAL_FAIL;
    clearScreen();
    ui->Title->setText("Nosto epäonnistui");
    ui->SecondTitle->setText(reason);
    ui->PushText4->setText(QString("Paluu"));
    ui->pushButton4->setDisabled(false);
}

void MainWindow::showWithdrawOk(QString amount)
{
    state = WITHDRAWAL_OK;
    clearScreen();
    ui->Title->setText("Nosto suoritettu");
    ui->SecondTitle->setText("Nostettu "+amount+" euroa");
    timer->start(4000);
}


void MainWindow::showATMSetLimit()
{

}

void MainWindow::showATMEvents()
{

}
