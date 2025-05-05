# System Zarządzania Zadaniami

Kompleksowy system zarządzania zadaniami zbudowany przy użyciu React, Node.js, Express i MongoDB.

## Funkcje

- **Uwierzytelnianie Użytkowników**: Bezpieczny system logowania i rejestracji z wykorzystaniem JWT
- **Kontrola Dostępu Oparta na Rolach**: Oddzielne uprawnienia dla administratorów i zwykłych użytkowników
- **Zarządzanie Zadaniami**: Tworzenie, przeglądanie, aktualizacja i usuwanie zadań
- **Przydzielanie Zadań**: Administratorzy mogą przydzielać zadania członkom zespołu
- **Śledzenie Postępów**: Monitorowanie wykonania zadań poprzez zdefiniowane etapy
- **Notatki i Komentarze**: Dodawanie notatek do zadań w celu współpracy
- **Aktualizacje Statusu**: Aktualizacja statusu zadań (oczekujące, w trakcie, zakończone, sprawdzone)
- **Zatwierdzanie Etapów**: Administratorzy mogą zatwierdzać ukończone etapy
- **Terminy Wykonania**: Określanie dat i godzin, do których zadania muszą być wykonane
- **Poziomy Priorytetu**: Przypisywanie zadaniom niskiego, średniego lub wysokiego priorytetu
- **Edycja Profilu**: Użytkownicy mogą aktualizować swoje dane osobowe i hasło
- **Usuwanie Konta**: Możliwość usunięcia konta użytkownika z odpowiednimi zabezpieczeniami

## Technologie

- **Frontend**: React, React Router, React Bootstrap
- **Backend**: Node.js, Express
- **Baza danych**: MongoDB
- **Komunikacja API**: Axios

## Struktura Aplikacji

- `client/`: Aplikacja frontendowa React
- `server/`: API backendowe Node.js

## Wymagania

- Node.js (v14.x lub nowszy)
- MongoDB (lokalna instalacja lub MongoDB Atlas)
- Menedżer pakietów npm lub yarn

## Instalacja

### Konfiguracja Backendu

1. Przejdź do katalogu serwera:
   ```
   cd server
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

3. Utwórz plik `.env` w katalogu serwera z następującymi zmiennymi:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-manager
   NODE_ENV=development
   ```

4. Uruchom serwer:
   ```
   npm run dev
   ```

### Konfiguracja Frontendu

1. Otwórz nowy terminal i przejdź do katalogu klienta:
   ```
   cd client
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

3. Uruchom serwer deweloperski React:
   ```
   npm start
   ```

## Uruchomienie Aplikacji

1. Uruchom usługę MongoDB na swoim lokalnym komputerze (jeśli korzystasz z lokalnego MongoDB)
2. Uruchom serwer backendowy: `cd server && npm run dev`
3. Uruchom aplikację frontendową: `cd client && npm start`
4. Wejdź do aplikacji w przeglądarce pod adresem `http://localhost:3000`

## Początkowa Konfiguracja

Przy pierwszym uruchomieniu aplikacji, musisz utworzyć użytkownika administratora:

1. Zarejestruj nowego użytkownika przez stronę rejestracji
2. Uzyskaj dostęp do bazy danych MongoDB i ręcznie zmień rolę użytkownika z "user" na "admin"

## Role Użytkowników

- **Administrator**: Może tworzyć zadania, przydzielać je użytkownikom, monitorować postępy, zatwierdzać etapy i zarządzać wszystkimi zadaniami
- **Użytkownik**: Może przeglądać przypisane zadania, aktualizować status zadań, dodawać notatki i oznaczać etapy zadań jako ukończone

## Zarządzanie Kontem

- Użytkownicy mogą edytować swoje dane profilowe, w tym imię, nazwisko i adres e-mail
- Możliwość zmiany hasła z odpowiednią walidacją
- Funkcja usuwania konta z zabezpieczeniami:
  - Użytkownicy z przypisanymi zadaniami muszą je zakończyć przed usunięciem konta
  - Nie można usunąć ostatniego administratora w systemie

## Zarządzanie Zadaniami

- Szczegółowe definiowanie zadań z opisami i terminami
- Określanie precyzyjnych terminów z datą i godziną
- Wizualizacja postępu poprzez paski postępu
- Możliwość dodawania notatek i komentarzy do zadań

## Licencja
Ten projekt jest objęty licencją MIT.



![{C9281D11-14A1-47B7-96E0-5CE146E93B58}](https://github.com/user-attachments/assets/3a4702af-01af-4d8e-9845-77e192cb8e50)
![{22459701-1C57-4C29-8F74-8A0538C07CF5}](https://github.com/user-attachments/assets/0dbb7308-7645-43f3-98b8-4784f20b808d)
![{CA921768-7B02-4DB4-9695-3B99DAD5E337}](https://github.com/user-attachments/assets/ba04f7dd-c4a9-4f32-823b-76dcb0b5b9b8)


