# JustPlay API

JustPlay API è un'applicazione Node.js per la gestione dei dati dei videogiochi. Questa API supporta funzionalità di autenticazione, autorizzazione, paginazione, caching, monitoraggio delle metriche e documentazione Swagger.

## Prerequisiti

- Node.js (v14 o superiore)
- MongoDB (v4 o superiore)

## Installazione

1. Clona il repository:
    ```bash
    git clone https://github.com/Geppe1990/justPlay-api.git
    cd justPlay-api
    ```

2. Installa le dipendenze:
    ```bash
    npm install
    ```

3. Crea un file `.env` nella root del progetto con il seguente contenuto:
    ```plaintext
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/videogames
    JWT_SECRET=your_jwt_secret
    ```

4. Avvia MongoDB:
    ```bash
    mongod --dbpath ~/mongodb-data
    ```

5. Avvia l'applicazione:
    ```bash
    npm run dev
    ```

## Struttura del Progetto

- `src/`
    - `app.ts`: File principale dell'applicazione.
    - `routes/`: Contiene le definizioni delle route.
        - `games.ts`: Route per la gestione dei videogiochi.
        - `auth.ts`: Route per la registrazione e login degli utenti.
    - `controllers/`: Contiene i controller per le route.
        - `gameController.ts`: Controller per le operazioni sui videogiochi.
        - `authController.ts`: Controller per le operazioni di autenticazione.
    - `services/`: Contiene i servizi per la logica di business.
        - `gameService.ts`: Servizio per la gestione dei videogiochi.
    - `models/`: Contiene i modelli Mongoose.
        - `Game.ts`: Modello per i videogiochi.
        - `Platform.ts`: Modello per le piattaforme.
        - `Genre.ts`: Modello per i generi.
        - `User.ts`: Modello per gli utenti.
    - `middleware/`: Contiene i middleware dell'applicazione.
        - `errorHandler.ts`: Middleware per la gestione degli errori.
        - `cache.ts`: Middleware per il caching.
        - `rateLimiter.ts`: Middleware per il rate limiting.
        - `metrics.ts`: Middleware per la raccolta delle metriche Prometheus.
    - `utils/`: Contiene utilità varie.
        - `logger.ts`: Configurazione di winston per il logging.
    - `swagger/`: Configurazione di Swagger per la documentazione delle API.
        - `swagger.ts`: Configurazione di Swagger.

## Funzionalità Implementate

### 1. Autenticazione e Autorizzazione
L'applicazione utilizza JWT (JSON Web Tokens) per autenticare e autorizzare gli utenti. Le route protette richiedono un token JWT valido.

### 2. Paginazione
Le route per ottenere i videogiochi supportano la paginazione tramite i parametri `page` e `limit`.

### 3. Rate Limiting
Per prevenire abusi delle API, l'applicazione utilizza `express-rate-limit` per limitare il numero di richieste per IP.

### 4. Caching
L'applicazione utilizza `apicache` per memorizzare nella cache le risposte delle API e migliorare le prestazioni.

### 5. Monitoraggio e Analisi
L'applicazione raccoglie metriche Prometheus tramite `prom-client` e le espone all'endpoint `/metrics`. Utilizza `morgan` per il logging delle richieste HTTP.

### 6. Documentazione Swagger
L'applicazione è documentata tramite Swagger. Puoi accedere alla documentazione interattiva all'endpoint `/api-docs`.

## API Endpoints

### Autenticazione

- **POST /auth/register**: Registra un nuovo utente.
    - Body: `{ "username": "your_username", "password": "your_password" }`

- **POST /auth/login**: Effettua il login e restituisce un token JWT.
    - Body: `{ "username": "your_username", "password": "your_password" }`

### Videogiochi

- **GET /games**: Ottiene tutti i giochi con paginazione.
    - Query params: `page`, `limit`

- **GET /games/:id**: Ottiene un gioco specifico per ID.

- **GET /games/search/:name**: Cerca giochi per nome.

- **GET /games/genre/:genreId**: Ottiene giochi per genere.

- **GET /games/platform/:platformId**: Ottiene giochi per piattaforma.

### Metriche

- **GET /metrics**: Espone le metriche Prometheus.

### Documentazione API

- **GET /api-docs**: Accedi alla documentazione Swagger delle API.

## Sviluppo

### Esecuzione dei Test

Per eseguire i test, assicurati di avere un file `.env.test` configurato con le variabili di ambiente necessarie.

Esegui i test:
```bash
npm test
```

### Conclusione
Questo `README.md` fornisce una guida generale del progetto, includendo le informazioni necessarie per l'installazione, la struttura del progetto, le funzionalità implementate, gli endpoint API disponibili, e come contribuire al progetto. Se ci sono ulteriori dettagli o specifiche che desideri aggiungere, fammelo sapere!
