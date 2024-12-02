import React, { } from 'react';
import { ScrollView } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';

const Credits = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Mikä on Kierttis?" />

      <BasicSection>
        Kierttis on innovatiivinen sovellus, joka tekee kierrättämisestä helppoa ja nopeaa! 
        Tavoitteemme on auttaa käyttäjiä löytämään uusi elämä käyttökelpoisille tavaroille ja tukea kestävämpää elämäntapaa kierrättämisen avulla. {"\n\n"}
        Toisen roska on toisen aarre, ja Kierttis tekee sen mahdolliseksi. Voit antaa omat tarpeettomat tavarasi eteenpäin ja löytää aarteita muilta käyttäjiltä. {"\n\n"}
        Tutustu palvelun käyttöohjeisiin ja aloita kierrättäminen Kierttiksellä jo tänään! {"\n\n"}
      </BasicSection>

      <Heading title="Käyttöohjeet" />

      <BasicSection>
        Kirjautunut käyttäjä voi julkaista ilmoituksen, joka näkyy kaikille palvelun rekisteröityneille käyttäjille suodatuksesta riippuen. {"\n\n"}
        
        Ilmoituksessa annetaan tiedot tuotteesta, sen sijainti ja mahdollinen kuva tuotteesta. {"\n"}
        Listautumiset julkaisuihin asettavat käyttäjän jonoon tuotteen saamiseksi. Ensimmäisellä sijalla oleva käyttäjä on noutovuorossa ja saa viestiyhteyden ilmoittajaan sopiakseen noudosta. {"\n\n"}
        Varaus on voimassa 6h. Mikäli ilmoittaja ei ole varauksen voimassaoloaikana merkinnyt tuotetta luovutetuksi, siirtyy noutovuoro se seuraavalle käyttäjälle jonossa. {"\n\n"}
        
        Ilmoitukset vanhenevat automaattisesti viikon kuluttua julkaisusta ja poistetaan palvelusta. {"\n"}
        Käyttäjä voi tarvittaessa julkaista ilmoituksensa uudelleen, mutta hänen tulee antaa tuotetiedot uudelleen. {"\n\n"}
      </BasicSection>

      <Heading title="Sovelluksen tausta" />
      <BasicSection>
          Kierttis on Oulun Ammattikorkeakoulun tietotekniikan opiskelijoiden kehittämä sovellus, joka kuuluu opintojaksoon Mobiilisovellusprojekti. {"\n\n"}

          Sovelluksen kehittäjät: {"\n\n"}
          • Rebecca Soisenniemi {"\n"}
          • Henkka Laukka {"\n"}
          • Matias Niemelä {"\n"}
          • Elina Lappalainen {"\n"}
      </BasicSection>

      <Heading title="Assettien käyttö" />
      <BasicSection>
        Palveluun sisällytetyt assetit, mm. kuvat ja fontit ovat tekijänoikeudellisesti suojattuja.{"\n"}
        Kiitämme kaikkia assettien tarjoajia tämän projektin hyväksi.{"\n\n"}
      </BasicSection>

    </ScrollView>
  );
};

export default Credits;
