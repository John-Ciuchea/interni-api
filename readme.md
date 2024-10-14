## Play API

Proiect simplu pentru autentificare passwordless.

### Requirements
* Proiectul folosește [Mailtrap](https://mailtrap.io) pentru simularea trimiterii de email-uri.
* nodejs v22.5

1. Clonează acest repository: `git clone ....` și accesează directorul `interni-api`
2. Copiază fișierul `.env.example` și redenumește-l în `.env`, apoi setează valorile pentru variabilele `MAILTRAP_TOKEN` și `MAILTRAP_INBOX_ID`
3. Instalează dependențele rulând comanda `npm install`
4. Opțional, poți modifica portul pe care rulează aplicația prin schimbarea valorii variabilei `APP_PORT` din fișierul `.env`
5. Pornește aplicația cu comanda `npm start`
---
### Endpoint-uri
Toate requesturile către endpointuri trebuie să conțină următoarele headere:
```shell
Accept: 'application/json'
withCredentials: true 
```

<details>
   <summary>POST /register</summary>

   ```http request
   POST /register
   Content-Type: application/json
   
   {
     "email": "test@example.com"
   }
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "status": "ok"
   }
   ```
* status code 422
  ```json
  {
      "email": [
          "Required"
      ]
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>
<details>
   <summary>POST /create-user</summary>

   ```http request
   POST /create-user
   Content-Type: application/json
   
   {
     "code": "codul-din-url-trimis-pe-email",
     "name": "John Doe"
   }
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "status": "ok"
   }
   ```
* status code 400
  ```json
  {
      "error": "'invalid code' sau 'expired code'" 
  }
  ```
* status code 422
  ```json
  {
      "name": [
          "Required"
      ],
      "code": [
          "Required"
      ]
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>
<details>
   <summary>POST /login</summary>

   ```http request
   POST /login
   Content-Type: application/json
   
   {
     "email": "test@example.com"
   }
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "status": "ok"
   }
   ```
* status code 422
  ```json
  {
      "email": [
          "Required"
      ]
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>
<details>
   <summary>POST /authenticate</summary>

   ```http request
   POST /authenticate
   Content-Type: application/json
   
   {
     "code": "codul-din-url-trimis-pe-email"
   }
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "status": "ok"
   }
   ```
* status code 400
  ```json
  {
      "error": "'invalid code' sau 'expired code'" 
  }
  ```
* status code 422
  ```json
  {
      "code": [
          "Required"
      ]
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>
<details>
   <summary>GET /me</summary>

   ```http request
   GET /me
   Content-Type: application/json
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "id": 1,
       "email": "mircea.ciuchea@gmail.com",
       "name": "Mircea Ciuchea",
       "loggedInUntil": "2024-10-07T05:46:51.289Z"
   }
   ```
* status code 401
  ```json
  {
      "error": "unauthenticated" 
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>
<details>
   <summary>POST /logout</summary>
   
   ```http request
   GET /logout
   Content-Type: application/json
   ``` 
   Răspunsuri:
* status code 200
   ```json
   {
       "status": "ok"
   }
   ```
* status code 401
  ```json
  {
      "error": "unauthenticated" 
  }
  ```
* status code 500
  ```json
  {
      "error": "something went wrong"
  }
  ```
</details>

---
## Task
Implementați autentificarea în proiectul vostru folosind acest API, urmând flow-ul de mai jos:
#### Register flow
1. Creați o pagină cu un formular de înregistrare, care să conțină doar un input pentru email.
2. Pagina va face un request POST către endpoint-ul `/register` 
3. API-ul va trimite un email cu un link de forma `http://localhost:{port}/create-user?code=....`
4. Dacă răspunsul de la API are status code 200, afișați un mesaj de succes, ex: "Verifică email-ul...".
5. Dacă răspunsul are status code 422, afișați erorile de validare sub câmpul marcat cu eroare (în acest caz doar email-ul).
6. Dacă răspunsul are status code 500, afișați un mesaj de eroare deasupra formularului.
7. Creați o pagină `/create-user` , care va verifica dacă în URL există un query param `code` și va afișa un formular cu următoarele input-uri:
   * `code`, de tip hidden, cu valoarea luată din query param.
   * `name`, de tip text, completat de utilizator.
8. Faceți un request POST către endpoint-ul `/create-user`
9. Dacă răspunsul are status code 200, redirecționați utilizatorul către pagina de login.
10. Dacă răspunsul nu este 200, afișați erorile (similar cu pașii 5-6).
11. După acest request, un utilizator cu email-ul și numele specificate va fi creat.

Vezi [register-flow.png](register-flow.png)

#### Login flow
1. Creați o pagină cu un formular de login, care să conțină un input pentru email.
2. Pagina va face un request POST către endpoint-ul `/login`
3. API-ul va trimite un email cu un link de forma `http://localhost:{port}/authenticate?code=....`
4. Creați o rută `/authenticate`, care va verifica dacă în URL există un query param `code` și va face un request POST către endpoint-ul
5. Dacă răspunsul are status code 200, autentificarea a reușit și în browser ar trebui să aveți un cookie numit `auth`
6. Dacă statusul nu este 200, afișați erorile.



## Task 2

* pentru status 4xx afisati erorile de la server, nu hardcodati
* folositi environment variables pentru domeniu cand faceti request-uri la api
* folositi route loader si action si mutati logica din pagini acolo
* pentru Alin: foloseste alt layout (UserLayout) pentru rutele fara autentificare
* faceti un [middelware](https://reactrouter.com/en/main/routers/create-browser-router#middleware) pentru rutele care nu au nevoie de autentificare (login, register ...) si daca user-ul este logat redirectionati catre '/' sau '/home' ...
* pentru rutele care necesita ca user-ul sa fie logat, implementati un alt middleware care sa verifice daca user-ul este este logat. daca user-ul nu este logat atunci redirectionati user-ul catre o pagina cu 2 butoane: login sau register sau catre pagina .... stiti voi :D
* logica din middleware sa nu fie pusa in routes.js(x)
* reenumiti layout-urile corespunzator. MainLayout->UserLayout ...
* in UserLayout adaugati buton de logout. request /logout si daca raspunsul este 200 redirectionati catre login/register.


