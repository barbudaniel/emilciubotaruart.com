# Manual de Administrare Website - Emil Ciubotaru

Acest document oferă instrucțiuni detaliate pentru utilizarea panoului de administrare a site-ului web Emil Ciubotaru.

## Cuprins

1. [Acces și Autentificare](#1-acces-și-autentificare)
2. [Prezentare Generală](#2-prezentare-generală)
3. [Gestionarea Lucrărilor de Artă (Bibliotecă Artă)](#3-gestionarea-lucrărilor-de-artă-bibliotecă-artă)
4. [Configurarea Homepage-ului](#4-configurarea-homepage-ului)
5. [Expoziții și Evenimente](#5-expoziții-și-evenimente)
6. [Despre Artist](#6-despre-artist)
7. [Setări Site și Navigație](#7-setări-site-și-navigație)
8. [Mesaje și Contact](#8-mesaje-și-contact)

---

## 1. Acces și Autentificare

Pentru a accesa panoul de administrare, navigați la adresa `/admin` a site-ului (ex: `emilciubotaru.com/admin`).

- **Login**: Introduceți credențialele de administrator (email și parolă) furnizate.
- **Logout**: Folosiți butonul "Deconectare" din partea de jos a meniului lateral pentru a părăsi sesiunea în siguranță.

---

## 2. Prezentare Generală

După autentificare, veți vedea panoul de control (Dashboard). În stânga se află meniul principal de navigare:

*   **Bibliotecă Artă**: Gestionarea portofoliului de lucrări.
*   **Homepage**: Personalizarea primei pagini.
*   **Expoziții**: Adăugarea și editarea evenimentelor.
*   **Despre Artist**: Editarea biografiei.
*   **Setări & Navigație**: Configurare identitate vizuală, logo, meniu și social media.
*   **Mesaje**: Vizualizarea mesajelor primite prin formularul de contact.

---

## 3. Gestionarea Lucrărilor de Artă (Bibliotecă Artă)

Aceasta este secțiunea centrală pentru portofoliu. Aici puteți adăuga, edita sau șterge lucrări.

### Adăugarea unei lucrări noi
1. Apăsați butonul **"Adaugă lucrare"** din dreapta sus.
2. Se va crea o lucrare nouă cu statusul "Draft".
3. Completați detaliile lucrării.

### Editarea detaliilor
Fiecare lucrare are următoarele câmpuri:

*   **Informații de bază**:
    *   **Titlu**: Numele lucrării.
    *   **Slug**: Se generează automat din titlu (folosit în link-ul paginii), dar poate fi editat manual dacă este necesar.
    *   **Colecție & Categorie**: Selectați colecția (ex: "Pictură") și categoria (ex: "Abstract") din lista definită în meniul de navigare.
    *   **Descriere**: Un scurt text descriptiv despre lucrare.
    *   **Status**:
        *   `Draft`: Vizibil doar în admin.
        *   `Published`: Vizibil public pe site.
        *   `Archived`: Ascuns din listele principale, dar păstrat în baza de date.
    *   **An**: Anul creației.

*   **Detalii Tehnice**:
    *   **Mediu / Materiale**: Ex: "ulei pe pânză, foiță de aur".
    *   **Dimensiuni**: Lățime, Înălțime, Adâncime (opțional) și unitatea de măsură (cm/in).

*   **Preț și Disponibilitate**:
    *   **Sumă și Monedă**: Introduceți prețul.
    *   **Disponibil**: Dacă lucrarea este de vânzare (`Da`) sau vândută/indisponibilă (`Nu`).
    *   **Note preț**: Informații suplimentare (ex: "ramă inclusă").

*   **Imagini**:
    *   **Imagine Principală (Hero)**: Imaginea reprezentativă care apare în liste. Puteți încărca o imagine nouă ("Upload") sau introduce un URL.
    *   **Galerie**: Adăugați imagini suplimentare (detalii, unghiuri diferite).
        *   Puteți seta o legendă (caption) pentru fiecare imagine.
        *   Opțiunea "Este cover?" marchează imaginea principală pentru carusel.

*   **Lucrări Conexe**: Selectați manual alte lucrări care să apară ca recomandări ("S-ar putea să vă placă și...") pe pagina acestei lucrări.

> **Notă**: Nu uitați să apăsați butonul de salvare globală (dacă există) sau să verificați mesajele de confirmare automată (sistemul salvează de obicei modificările în timp real sau la apăsarea unui buton dedicat de "Salvare" în partea de jos a paginii, în funcție de implementare).

---

## 4. Configurarea Homepage-ului

### Hero Homepage (Zona de sus)
Aici controlați prima impresie a vizitatorilor:
*   **Imagine de fundal**: Încărcați o imagine de impact.
*   **Texte**:
    *   *Eyebrow*: Text mic deasupra titlului (ex: "Painter Artist").
    *   *Titlu*: Numele sau titlul principal.
    *   *Descriere*: Scurtă introducere.
*   **Butoane (CTA)**: Configurați butonul principal (ex: "Vezi galeria") și cel secundar (ex: "Contact").

### Secțiuni Homepage
Puteți construi pagina principală din blocuri modulare:
1. **Adăugare**: Apăsați "Adaugă secțiune".
2. **Ordonare**: Trageți de iconița din stânga titlului secțiunii pentru a reordona blocurile (Drag & Drop).
3. **Configurare Secțiune**:
    *   **Tip**: Alegeți tipul de conținut (ex: `featured-art` pentru lucrări evidențiate, `statement` pentru text, `expositions` pentru ultimele expoziții).
    *   **Layout**: Modul de afișare (full, split, grid).
    *   **Lucrări asociate**: Pentru secțiunile de tip galerie, bifați lucrările care doriți să apară.

---

## 5. Expoziții și Evenimente

Gestionați cronologia activității artistice.

*   **Adăugare Expoziție**: Creează o intrare nouă.
*   **Detalii**:
    *   **Titlu & Slug**.
    *   **Locație**: Spațiu (ex: "Galeria X") și Oraș/Țară.
    *   **Perioadă**: Data de început și sfârșit.
    *   **Status**: `În curând`, `În desfășurare`, `Arhivată`.
    *   **Descriere**: Text despre eveniment.
    *   **Imagine**: Imaginea afișului sau o fotografie din expoziție.
    *   **Lucrări evidențiate**: Selectați lucrările care au făcut parte din expoziție.
    *   **Linkuri**: Adăugați linkuri către presă, bilete sau cataloage externe.

---

## 6. Despre Artist

Pagina de biografie (`/about`).
*   **Headline & Rezumat**: Titlul și textul introductiv.
*   **Biografie / Content**: Textul principal (suportă formatare de bază).
*   **Imagine Profil**: Fotografia portret a artistului.

---

## 7. Setări Site și Navigație

### Identitate Vizuală
*   **Logo**: Încărcați sigla site-ului (format SVG recomandat sau PNG transparent).
*   **Lockup Text & Tagline**: Textul care apare lângă logo (numele) și subtitlul site-ului.

### Social Media
*   Gestionați linkurile către profilurile sociale (Instagram, Facebook, etc.).
*   Puteți ascunde temporar anumite platforme fără a le șterge.

### Navigație (Meniu)
*   Configurați structura meniului principal.
*   **Link-uri principale**:
    *   Puteți seta link-ul ca **Highlight** (evidențiat vizual) sau **Extern** (se deschide în tab nou).
    *   Adăugați o descriere (opțională) pentru tooltip-uri.
*   **Sub-meniuri**:
    *   Adăugați "Sub-link" pentru a crea categorii (Dropdown).
    *   **Important**: Link-urile pentru subcategorii sunt generate automat pe baza numelui și a părintelui (ex: dacă părintele este `/painting-art` și sub-link-ul este `Abstract`, adresa devine `/painting-art?category=abstract`).

### Pagina de Contact
*   **Date de contact**: Adăugați email, telefon, adresă.
*   **Program atelier**: Definiți intervalele orare.
*   **Map Embed**: Introduceți link-ul de embed de la Google Maps pentru a afișa harta.

---

## 8. Mesaje și Contact

Această secțiune centralizează mesajele primite prin formularul de contact.

*   **Lista de mesaje**: Vizualizați rapid expeditorul, subiectul și statusul.
*   **Detalii și Acțiuni**:
    *   Dând click pe un mesaj, puteți vedea conținutul complet.
    *   **Contact**: Click pe adresa de email sau telefon pentru a răspunde (deschide aplicația dvs. de mail/telefon).
*   **Status**: Actualizați manual stadiul fiecărui mesaj pentru a ține evidența:
    *   `Necitit` (Implicit)
    *   `Citit`
    *   `Răspuns` (Marchează că ați trimis reply)
    *   `Arhivat`
*   **Notițe Interne**: Puteți adăuga observații private la fiecare mesaj (ex: "De revenit cu ofertă în toamnă").

---

## Sfaturi pentru Administrare

1.  **Optimizare Imagini**: Pentru performanța site-ului, încercați să încărcați imagini optimizate (format WebP sau JPG comprimat), ideal sub 500KB pentru imagini mari și sub 200KB pentru cele mici.
2.  **SEO**: Completați câmpurile de descriere și titlu cu atenție, folosind cuvinte cheie relevante pentru artă și numele artistului.
3.  **Backup**: Deși site-ul are o bază de date sigură, este recomandat să păstrați copii locale ale textelor importante și imaginilor originale ale lucrărilor.

