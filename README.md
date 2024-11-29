# Kierrätyssovellus 

---------------------------------

### Tekijät

- Rebecca Soisenniemi ([suklaanen](https://github.com/suklaanen))
- Henkka Laukka ([MacStache](https://github.com/MacStache))
- Matias Niemelä ([matiasdni](https://github.com/matiasdni))
- Elina Lappalainen ([c2lael03](https://github.com/c2lael03))

---------------------------------

Tämä repositorio esittelee Oulun ammattikorkeakoulun tieto- ja viestintätekniikan opiskelijoiden tekemää sovellusta, joka kuuluu toteutukseen **Mobiilikehitysprojekti** (6 op + 3 op). 
Hankkeen tarkoituksena on oppia kokonaisvaltaista mobiilikehitystä ketteriä menetelmiä sekä versionhallintajärjestelmää käyttäen. 

### Esitysmateriaali

- _mm. videot_
  
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

- Android-toteutus React nativella 
- Autentikointi Firebase
- Tietokanta Firestore
