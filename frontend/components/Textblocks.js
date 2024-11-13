import React from 'react';
import { Text, ScrollView } from 'react-native';
import { Heading, BasicSection } from './CommonComponents';
import { ButtonContinue } from './Buttons';
import { useNavigation } from '@react-navigation/native';
import SwitchingBackgrounds from './SwitchingBackgrounds';

export const CreditsOfThisApp = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Tietoja sovelluksesta" />
          <BasicSection>
              Kierttis on Oulun Ammattikorkeakoulun tietotekniikan opiskelijoiden kehittämä sovellus, joka kuuluu opintojaksoon Mobiilisovellusprojekti. {"\n\n"}

              Sovelluksen kehittäjät: {"\n\n"}
              • Rebecca Soisenniemi {"\n"}
              • Henkka Laukka {"\n"}
              • Matias Niemelä {"\n"}
              • Elina Lappalainen {"\n"}
              {"\n\n"}
          </BasicSection>

        <Heading title="Tekijänoikeudet" />
          <BasicSection>
            Palveluun sisällytetyt assetit, mm. kuvat ja fontit ovat tekijänoikeudellisesti suojattuja.{"\n"}
            Kiitämme kaikkia assettien tarjoajia tämän projektin hyväksi.{"\n\n"}

          <Text style={{ fontWeight: 'bold' }}>Kuvat</Text> {"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>Fontit</Text> {"\n\n"}

          </BasicSection>
  </ScrollView>
  );
};

export const IntroducingThisApplication = () => {
  
    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <SwitchingBackgrounds />
        <Heading title="Tervetuloa käyttämään Kierttis -palvelua!" />

          <BasicSection>
          Kierttis on innovatiivinen sovellus, joka tekee kierrättämisestä helppoa ja nopeaa! 
          Meidän tavoitteemme on auttaa käyttäjiä löytämään uusi elämä käyttökelpoisille tavaroille ja tukea kestävämpää elämäntapaa kierrättämisen avulla. {"\n\n"}

          Toisen roska on toisen aarre, ja Kierttis tekee sen mahdolliseksi. Voit antaa omat tarpeettomat tavarasi eteenpäin ja löytää aarteita muilta käyttäjiltä. {"\n\n"}

          Tutustu palvelun käyttöohjeisiin ja aloita kierrättäminen Kierttiksellä jo tänään! {"\n\n"}

          Rekisteröityneenä käyttäjänä voit: {"\n"}
              • Selata ja suodattaa ilmoituksia kaikkialta Suomesta {"\n"}
              • Julkaista omia ilmoituksia ja hallinnoida niitä {"\n"}
              • Varata tai jonottaa tarvitsemiisi tuotteisiin {"\n"}
              • Sopia tuotteen luovutuksesta viestitse {"\n"}
          </BasicSection>

        <Heading title="Miten Kierttistä käytetään?" />

        <BasicSection>
          Kirjautunut käyttäjä voi julkaista ilmoituksen, joka näkyy kaikille palvelun rekisteröityneille käyttäjille suodatuksesta riippuen. {"\n\n"}
          
          Ilmoituksessa on tietoa tuotteesta, sen sijainnista ja mahdollinen kuva tuotteesta. {"\n"}
          Julkaisija asettaa ilmoituksen tyypiksi "Jonotus" tai "Poiminta", joiden käytännöt hieman eroavat toisistaan. {"\n\n"}
          Jonotus -periaatteella toimitaan siten, että ensimmäinen varaaja saa viestiyhteyden ilmoittajaan ja voi sopia noudosta ja muut jäävät jonoon. {"\n"}
          Mikäli julkaisija ei merkitse tuotetta noudetuksi tai varaaja peruu varauksensa, se siirtyy seuraavalle jonossa olevalle XX tunnin kuluessa. {"\n\n"}

          Poiminta -periaatteella varauksen yhteydessä annetaan julkaisijalle lisätietona mahdollinen noutoaika tai muu oleellinen lisätieto. Julkaisija voi jonottajista tällöin valita, kenelle tuotteen luovuttaa. {"\n"}
          Tässä tapauksessa jos varaus peruuntuu tai tuotetta ei noudeta, julkaisija voi poimia jonottajien pinosta seuraaavan hänelle sopivimman vaihtoehdon. {"\n\n"}

          Kaikissa tapauksissa toivotaan Kierttiksen puolesta mahdollisimman nopeaa noutoa. Ilmoitukset vanhenevat automaattisesti viikon kuluttua julkaisusta ja poistetaan palvelusta. {"\n"}
          Käyttäjä voi tarvittaessa julkaista ilmoituksensa uudelleen jos hänellä on käytettäviä julkaisukertoja jäljellä, mutta hänen tulee antaa tuotetiedot uudelleen. {"\n\n"}

          Palvelussa on myös käyttäjäkohtaisia rajoituksia julkaisujen määrään ja jonotuksiin tai varauksiin. {"\n\n"}
          Something about maksullinen vs ilmainen käyttäjä? {"\n"}
          Ja siitä, ettei käyttäjä voi ruuhkauttaa palvelua ja olla jonossa liikaan määrään tuotteita samaan aikaan. {"\n\n"}

        </BasicSection>
      </ScrollView>
    );
  };

export const BasicsOfGettingAnAccount = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Tilin hallinta" />
        <BasicSection>
          Täällä voisit luoda käyttäjätunnuksen palveluun ja kirjautua sisään.{"\n\n"}
        </BasicSection>
      </ScrollView>
    );
  };

  export const BasicsOfSecuringThisAccount = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Tilin hallinta" />
        <BasicSection>
            Täällä voit vaihtaa käyttäjätunnuksesi salasanan tai poistaa tilisi palvelusta.{"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>Vaihda salasana</Text> -painike avaa uuden näkymän, jossa voit vaihtaa salasanan.{"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>Poista tili</Text>  -painike avaa varmistusikkunan, jossa voit poistaa tilisi pysyvästi.{"\n"}
            <Text style={{ fontStyle: 'italic' }}>
            Huomioithan, että tilin poistaminen poistaa myös kaikki julkaisemasi ilmoitukset ja aktiiviset jonosijasi ja keskustelusi palvelusta.
            </Text>
        </BasicSection>
      </ScrollView>
    );
  };

