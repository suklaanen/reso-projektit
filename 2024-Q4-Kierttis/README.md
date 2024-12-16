# Kierrätyssovellus 

---------------------------------

### Tekijät
- Elina Lappalainen ([c2lael03](https://github.com/c2lael03))
- Henkka Laukka ([MacStache](https://github.com/MacStache))
- Matias Niemelä ([matiasdni](https://github.com/matiasdni))
- Rebecca Soisenniemi ([suklaanen](https://github.com/suklaanen))
  
---------------------------------

Tämä repositorio esittelee Oulun ammattikorkeakoulun tieto- ja viestintätekniikan opiskelijoiden tekemää sovellusta, joka kuuluu toteutukseen **Mobiilikehitysprojekti** (6 op + 3 op). 
Hankkeen tarkoituksena on oppia kokonaisvaltaista mobiilikehitystä ketteriä menetelmiä sekä versionhallintajärjestelmää käyttäen. 
  
---------------------------------

## Sovelluksen kuvaus
Kierttis tarjoaa digitaalisen alustan kierrätykselle, jossa asiakkaat voivat jakaa ja vastaanottaa kierrätettäviä tavaroita helposti ja ekologisesti. 
Sovelluksena se perustuu sosiaalisen median roskalavaryhmiin. 

### Ominaisuuksia
- Käyttäjä voi julkaista tavaroita annettavaksi sekä hallinnoida julkaisujaan.
- Käyttäjä voi listautua jonoon / varaajaksi tuotteeseen sekä poistaa varauksiaan.
- Julkaisija ja käyttäjä näkee jonottajien määrän tuotteessa sekä jonottaja saa jonotussijansa.
- Jonotus etenee ja pinosta vanhentuneet varaukset poistuvat, _varaus on voimassa edellisen sijan päättymisestä 6h._
- Ilmoitus on voimassa kunnes julkaisija merkitsee tuotteen luovutetuksi / poistaa sen, ja silti - enintään viikon verran julkaisusta.
- Julkaisijan ja 1. sijalla olevan varaajan välille avataan viestiketju, jossa he voivat sopia tuotteen luovutuksesta.
- Viestiketjut lähtevät vanhentuneiden ja peruuntuneiden varausten mukana.

---------------------------------

## Teknologiat
- Android-toteutus React nativella (Expo)
- Autentikointi Firebase
- Tietokanta Firestore
- Ajoympäristö Node.js

---------------------------------

## Sovelluksen rakenne

Sovellus sisältää seuraavat kansiot:

```./```: Sisältää sovelluksen käynnistymisessä olennaiset tiedostot kuten App.js

```./assets/```: Sisältää sovelluksen käyttämät kuvat

```./components/```: Sisältää sovelluksen käyttämiä komponentteja kuten ylä- ja alapalkit sekä painikkeet

```./context/```: Sisältää autentikaatioon, sisällön lataamiseen ja viestijärjestelmään liittyviä kontekstitiedostoja

```./screens/```: Sisältää sovelluksen eri näkymiä kuten tilinäkymä, chatnäkymä sekä kotinäkymä

```./services/```: Sisältää erilaisiin sovelluksen käyttämiin palveluihin liittyviä yhteystiedostoja kuten Firebase sekä Firestore


---------------------------------

## Sovelluksen käyttö
Kun sovellus avataan niin se avautuu kirjautumisnäkymään. Kirjautumisnäkymästä pääsee myös rekisteröitymään.

Kirjautumisen/Rekisteröitymisen jälkeen sovellus siirtyy kotinäkymään, jonka alareunasta pääsee siirtymään kierrätystavaralistaukseen tai tilinhallintaan.

Kierrätystavaralistauksessa on listattuna tarjolla olevat ilmoitukset. Yläreunan valikon kautta voi luoda omia ilmoituksia sekä tarkastella jo tehtyjä ilmoituksia sekä varauksia.

Tilinhallintanäkymässä puolestaan voi tarkastella varausten myötä syntyneitä keskusteluja, omia ilmoituksia sekä varauksia, hallita tiliä sekä kirjautua ulos sovelluksesta.

| Kirjautumisnäkymä | Kotinäkymä | Kierrätystavaralistaus | Tilinhallintanäkymä |
| ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| ![Screenshot_20241211-172124](https://github.com/user-attachments/assets/780150d8-d614-4543-9440-ffe5b5e53543) | ![Screenshot_20241211-172133](https://github.com/user-attachments/assets/6b9d548a-b31c-4a49-9982-8c5363a8125b) | ![Screenshot_20241211-172157](https://github.com/user-attachments/assets/00ca76e7-5af2-4c7f-9bc7-f20e18e1f7dd) | ![Screenshot_20241211-172211](https://github.com/user-attachments/assets/ee319cfb-b541-4f5c-8ef9-d5461edb27bf)

---------------------------------
## Asennus

### Kloonaus
Voit kloonata repositorion käyttämällä valitsemassasi terminaalissa komentoa:

```
git clone https://github.com/TVT23KMO-R4-Mobiilisovellusprojekti/2024-Q4-Mobiili
```

### Projektin käynnistäminen paikallisesti 
Projektin voi käynnistää paikallisesti valitsemassasi terminaalissa komennoilla:

```
npm install
npm start
```

Tämän jälkeen sovelluksen voi avata ja sitä voi käyttää älypuhelimen (Android tai iOS) Expo Go -sovelluksella

### Firebasen konfigurointi
Firebasen konfigurointiin löydät ohjeet [Firebasen dokumentaatiosta](https://firebase.google.com/docs/web/setup).

---------------------------------


