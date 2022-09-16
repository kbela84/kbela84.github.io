# Wanderer - The RPG game

Készíts egy hős alapú, mezőkön mozgós, szörnyeket gyilkolós játékot. Hősünket
billentyűzet segítségével irányíthatjuk egy útvesztőben. A hősnek és a
szörnyeknek szintjük (level) és értékeik (stats) vannak amelyek a szinttől
függnek. A cél, hogy elérd a legmagasabb szintet a szörnyek levágásával és a
náluk relytőző kulcs megtalálásával, ami a következő szintre vezet.

## Workshop: Tervezd meg a munkád

### 0. Forkold le ezt a repository-t (a saját user-hez)

### 1. Klónozd a repository-t a gépedre

### 2. Menj végig a technikai részleteken

#### Hogyan indítsd el a programot

A klónozott repóban:

- Futtasd: `npm install` a modulok telepítéséhez

- Futtasd: `npm start` a fejlesztő szerver indításához és az automatikus
  kompilációhoz

- Nyisd meg a `localhost:8080`-at a böngészőben

Biztosítottunk egy példát néhány szükséges funkcióval.

Tartalmaz:

- egy nagy rajzolható canvas elemet, egy már rárajzolt képpel és a
- gombnyomások kezelését, a hősöd mozgatásához
- tartsuk észben, hogy ezek csak a szükséges koncepciók egy helyen
- úgy szeparálhatod el őket ahogy szeretnéd

```javascript
'use strict';

// Hozzájutni a rajz contexthez
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ez a függvény azután fut le, hogy a képek betöltöttek
window.onload = () => {
  // Kirajzolni egy padló csempét
  const image = document.getElementById('floor');
  ctx.drawImage(image, 50, 50);

};

/* Csak ki kell cserélned a paraméter string-et a document.getElementById('floor')-ban
 *
 * Lehetséges képek:
 * - floor
 * - wall
 * - hero-up
 * - hero-right
 * - hero-down
 * - hero-left
 * - boss
 * - skeleton
 */

// Függvény a gombnyomások kezelésére
function onKeyPress(event) {
  // Nyilak kezelése
  switch (event.keyCode) {
    case 37:
      alert('balra');
      break;
    case 38:
      alert('fel');
      break;
    case 39:
      alert('jobbra');
      break;
    case 40:
      alert('le');
      break;
  }
}

// Event listener hozzáadaása a gombnyomásokra
document.body.addEventListener('keydown', onKeyPress);
```

### 3. Készíts egy GitHub projektet

- késztsd el a projekt repó alatt és add hozzá a [projekt
  sztorikat](https://github.com/green-fox-academy/teaching-materials/blob/master/project/wanderer/stories.hu.md).

### 4. Alkossatok csoportokat és tervezzétek meg az applikációtokat együtt

Tervezd meg a felépítést. A felépítésben az alábbi elemeket gondold át:

- Modellek
  - JátékObjektum
    - Karakter
      - Szörny
      - Hős
      - tipusok
    - Terület / Pálya
    - Csempe
      - ÜresCsempe
      - NemÜresCsempe
- JátékLogika
  - jelenlegi hős
  - jelenlegi pálya
- Main
  - események kezelése
  - jelenlegi játék

### 5. Gondolkodjatok a feladatok (tasks) szétbontásáról Kanban

Most, hogy összeállt a kép, **menjetek végig a sztorin együtt** és
gondolkodjatok el azon hogyan bontanátok le kisebb feladatokra:

- Osztályokra
- Függvényekre
- Adatokra és cselekvésekre
- Bővítsd ki a sztorit kártyákat ezekkel a pontokkal emlékeztetőként

#### 6. Kezdj el dolgozni az első feladatodon!
