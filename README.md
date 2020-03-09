# Lyceum API

Nacahází se na portu 3000, který lze ale kdykoliv změnit v souboru *.env*. Soubor dále obsahuje 
název aplikace, aktuální prostředí - v současné době vývojové (development), název a adresu databáze - *mongodb://localhost:27017*

## Autentizace
*auth.ctrl.js + auth.routes.js*

*Cesta:* /api/ + **auth**

V *auth.ctrl.js* se nachází vše spojené s ověřováním uživatele. Přihlášení, odhlášení, povolení a zamezení přístupu do aplikace.

#### Google přihlášení:

*Metoda:* POST

*Cesta:* /google/login

**Vstupní data:**
- token

**Úspěšný výstup:**

Status kód: **200**

- Token je validní.

```json
code: {
    "message": 'Nyní jste úspěšně přihlášen(a)',
    "status": 200,
    "success": true
},
user: {
    "name": "Martin Foldyna"
    "picture": "https://lh3.googleusercontent.com/a-/AOh14GjBTwfgT60PBPGKtHqZ8FCRPO-LaK0RQ1K-DtR5=s96-c"
    "email": "martin.foldyna@pslib.cz"
    "role": "Teacher"
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE3ZDU1ZmY0ZTEwOTkxZDZiMGVmZDM5MmI5MWEzM2U1NGMwZTIxOGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjMxODMxOTgwNDAtdDdrcTYwb2Njam84dXFwYzYwYm1hc2c2ZzBzMnI0MnAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MzE4MzE5ODA0MC10N2txNjBvY2Nqbzh1cXBjNjBibWFzZzZnMHMycjQycC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMTM0MDM0NDEwNDg2MTAyMDc3MiIsImhkIjoicHNsaWIuY3oiLCJlbWFpbCI6Im1hcnRpbi5mb2xkeW5hQHBzbGliLmN6IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI4SmJYSnowTXkwSFNEZThvR3dRczZBIiwibmFtZSI6Ik1hcnRpbiBGb2xkeW5hIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqQlR3ZmdUNjBQQlBHS3RIcVo4RkNSUE8tTGFLMFJRMUstRHRSNT1zOTYtYyIsImdpdmVuX25hbWUiOiJNYXJ0aW4iLCJmYW1pbHlfbmFtZSI6IkZvbGR5bmEiLCJsb2NhbGUiOiJjcyIsImlhdCI6MTU4MzY5MTQ4OSwiZXhwIjoxNTgzNjk1MDg5LCJqdGkiOiJiZDllOTY4YzYzYzJhZmIyYThkZDczYzg4NmY0OWY0NDNjZDJlYWIzIn0.irNMTVdMBuNKFmDIVXzu0gMJh0yF8wAeI-qlasV3o44UkW5x_TBMsaA0iKP32gX7LRfnhf3jNU7u_Qufh8kmLZGSp23UICUDkRSkNJYvAIEs014hYXYOYZCgeBlblo6qA31ApK7T2hNo3iAvFB5bZARRonCcs70xGuJfeAPj1r212fvK37YSSsKZ2n4bjJx2vJeYWqPqMg10XsGtFIvHSGbNiIb7LntIUYWKbLwEXeigRuA_y6oVp8AOZcXgwikPuulhjga4uV-ItE2kzxxpJH0sQ95TeyXijL_Ucyj2DR7qG1A0PChfEWxC3uurFTmhQ4dop2KjbjDfSLoYkgqtig"
}
```

**Neúspěšný výstup**

Status kód: **403** 

- Uživatel nepoužil k přihlášení email @pslib.cz.
```json
code: {
    "message": 'K přihlášení použijte @pslib.cz, @pslib.cloud, @365.pslib.cz účet.',
    "status": 403,
    "success": false
},
user: null
```

#### Microsoft přihlášení:

*Metoda:* POST

*Cesta:* /microsoft/login

**Vstupní data:**
- token

**Úspěšný výstup:**

Status kód: **200**

- Token je validní.

```json
code: {
    message: 'Nyní jste úspěšně přihlášen(a)',
    status: 200,
    success: true
},
user: {
    name: "Foldyna Martin"
    email: "martin.foldyna@365.pslib.cz"
    role: "Teacher"
}
```

**Neúspěšný výstup**

Status kód: **403** 

- Uživatel nepoužil k přihlášení email @365.pslib.cz nebo @pslib.cloud.
```json
code: {
    message: 'K přihlášení použijte @pslib.cz, @pslib.cloud, @365.pslib.cz účet.',
    status: 403,
    success: false
},
user: null
```

#### Povolení uživateli přístup k aplikaci:

*Metoda:* POST

*Cesta:* /authorise/:id

**Vstupní data:**
- id uživatele - parametr id v cestě

**Úspěšný výstup:**

Status kód: **200**

- Autorizovávaný uživatel je nalezen podle id a jeho stav byl "unauthorised"
- Role uživatele, který autorizuje daného uživtele je "teacher" a "admin"

```json
code: {
    "message": 'Uživatel byl oprávněn ke vstupu do aplikace.',
    "status": 200,
    "success": true
},
user: {
    "_id": ObjectId("5e59452146f3a471b1584d37"),
    "email" : "martin.foldyna@365.pslib.cz",
    "name": "Foldyna Martin",
    "state" : "authorised",
    "role" : "Teacher",
}
```

**Neúspěšný výstup**

Status kód: **401** 

- Role uživatele, který autorizuje daného uživtele není "teacher" a "admin"
```json
code: {
    message: 'K této akci nejste oprávněni.',
    status: 401,
    success: false
},
user: null
```

#### Zrušení uživateli přístup k aplikaci:

*Metoda:* POST

*Cesta:* /deauthorise/:id

**Vstupní data:**
- id uživatele - parametr id v cestě

**Úspěšný výstup:**

Status kód: **200**

- Deautorizovávaný uživatel je nalezen podle id a jeho stav byl "authorised"
- Role uživatele, který deautorizuje daného uživtele je "teacher" a "admin"

```json
code: {
    message: 'Uživateli bylo odebráno oprávnění k přístupu do aplikace.',
    status: 200,
    success: true
},
user: {
    _id : ObjectId("5e59452146f3a471b1584d37"),
    email : "martin.foldyna@365.pslib.cz",
    name : "Foldyna Martin",
    state : "unauthorised",
    role : "Teacher",
}
```

**Neúspěšný výstup**

Status kód: **401** 

- Role uživatele, který deautorizuje daného uživtele není "teacher" a "admin"
```json
code: {
    message: 'K této akci nejste oprávněni.',
    status: 401,
    success: false
},
user: null
```

## Fotky

*photo.ctrl.js + photo.routes.js*

*Cesta:* /api/ + **photo**

V *photo.ctrl.js* se nachází vše spojené s procesováním obrázků. Jejich nahrávání a načítání.

#### Nahrávání:

*Metoda:* POST

*Cesta:* /upload

**Vstupní data:**
- řetězec s obrázkami k nahrání

**Úspěšný výstup:**

Status kód: **200**

```json
code: {
    message: 'Všechny obrázky byly úspěšně nahrány.',
    status: 200,
    success: true
}
```
**Neúspěšný výstup:**

Status kód: **zaláží na typu erroru** 

- Při ukládání obrázků se vyskytla chyba

#### Načítání:

*Metoda:* POST

*Cesta:* /retrieve/:subject/:filter

**Vstupní data:**
- parametr subject: obrázky kterého předěmtu se mají vyhledat v databázi 
- parametr filter: mají-li se načíst pouze malé obrázky nebo i velké

**Úspěšný výstup:**

Status kód: **200**

- obrázky byly dle vstupních kriterí vyhledány

```json
code: {
    message: 'Všechny obrázky byly načteny.',
    status: 200,
    success: true
},
photos: [
    {_id: "5e60101762af2c828fe78512"
    filename: "th_DSC_0379.jpg"
    base64: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFR.."
    orientation: -1
    createdAt: "2020-03-04T20:31:19.971Z"
    createdBy: {name: "Foldyna Martin", email: "martin.foldyna@365.pslib.cz", role: "Teacher"}
    classYear: 3},
    {_id: "5e60101762af2c828fe78511"
    filename: "th_DSC_0100.jpg"
    base64: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFR.."
    orientation: -1
    createdAt: "2020-03-04T20:31:19.405Z"
    createdBy: {name: "Foldyna Martin", email: "martin.foldyna@365.pslib.cz", role: "Teacher"}
    classYear: 2},{..}
]
```

**Neúspěšný výstup**

Status kód: **404** 

- Požadované obrázky nebyly dle kritérii nalezeny

```json
code: {
    message: 'Požadované obrázky nebyly nalezeny.',
    status: 404,
    success: false
},
photos: null
```
#### Načítání velkých obrázků pro určitou kolekci obrázků:

*Metoda:* POST

*Cesta:* /retrieveForGroup/:group

**Vstupní data:**
- parametr group: o jakou kolkeci se jedná (= například v technických výkresech se jednou kolekcí rozumí všechny tři obrázky daného výkresu)

**Úspěšný výstup:**

Status kód: **200**

- velké obrázky byly pro danou kolekci vyhledány

```json
code: {
    message: 'Všechny obrázky byly načteny.',
    status: 200,
    success: true
},
photos: [
    {_id: "5e60101762af2c828fe78512"
    filename: "DSC_0379.jpg"
    base64: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFR.."
    orientation: -1
    createdAt: "2020-03-04T20:32:19.971Z"
    createdBy: {name: "Foldyna Martin", email: "martin.foldyna@365.pslib.cz", role: "Teacher"}
    classYear: 3},
    {_id: "5e60101762af2c828fe78511"
    filename: "DSC_0100.jpg"
    base64: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFR.."
    orientation: -1
    createdAt: "2020-03-04T20:32:19.405Z"
    createdBy: {name: "Foldyna Martin", email: "martin.foldyna@365.pslib.cz", role: "Teacher"}
    classYear: 2},{..}
]
```

**Neúspěšný výstup**

Status kód: **404** 

- Požadované obrázky nebyly dle kritérí nalezeny

```json
code: {
    message: 'Požadované obrázky nebyly nalezeny.',
    status: 404,
    success: false
},
photos: null
```

## Příspěvky

*post.ctrl.js + post.routes.js*

*Cesta:* /api/ + **post**

V *post.ctrl.js* se nachází vše spojené s procesováním příspěvků. Jejich nahrávání, upravování a načítání.

#### Nahrávání:

*Metoda:* POST

*Cesta:* /add/:subject

**Vstupní data:**
- řetězec s obrázkami k nahrání
- paremetr předmět

**Úspěšný výstup:**

Status kód: **200**

- Příspěvek byl úspěšně nahrán

```json
code: {
    message: 'Příspěvek byl úspěšně nahrán.',
    status: 200,
    success: true
},
post: {
    _id : ObjectId("5e5e219d562f9d2abc2a8791"),
    title : "Test videa",
    createdAt : ISODate("2020-03-03T09:21:33.024Z"),
    createdBy : {
        name : "Foldyna Martin",
        email : "martin.foldyna@365.pslib.cz",
        role : "Teacher"
    },
    thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQa..",
    subject : "MME",
    classYear : 3,
    url : "https://www.youtube.com/",
    __v : 0,
}
```
**Neúspěšný výstup:**

Status kód: **zaláží na typu erroru** 

- Při ukládání příspěvku se vyskytla chyba

#### Načítání:

*Metoda:* POST

*Cesta:* /load/:subject

**Vstupní data:**
- parametr subject: příspěvky kterého předěmtu se mají vyhledat v databázi 

**Úspěšný výstup:**

Status kód: **200**

- příspěvky byly dle vstupních kriterí vyhledány

```json
code: {
    message: 'Všechny příspěvky byly načteny.',
    status: 200,
    success: true
},
post: [
    _id : ObjectId("5e5e219d562f9d2abc2a8791"),
    title : "Test videa",
    createdAt : ISODate("2020-03-03T09:21:33.024Z"),
    createdBy : {
        name : "Foldyna Martin",
        email : "martin.foldyna@365.pslib.cz",
        role : "Teacher"
    },
    thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQa..",
    subject : "MME",
    classYear : 3,
    url : "https://www.youtube.com/",
    __v : 0,
    updatedAt : ISODate("2020-03-05T09:01:17.170Z"),
    updatedBy : {
        name : "Martin Foldyna",
        picture : "https://lh3.googleusercontent.com/a-/AOh14GjBTwfgT60PBPGKtHqZ8FCRPO-LaK0RQ1K-DtR5=s96-c",
        email : "martin.foldyna@pslib.cz",
        role : "Teacher",
    }
]
```

**Neúspěšný výstup**

Status kód: **404** 

- Požadované příspěvky nebyly dle kritérí nalezeny

```json
code: {
    message: 'Požadované příspěvky nebyly nalezeny.',
    status: 404,
    success: false
},
post: null
```

#### Upravování:

*Metoda:* POST

*Cesta:* /update/:id

**Vstupní data:**
- parametr id: který příspěvek má být upraven
- obsah upraveného příspěvku

**Úspěšný výstup:**

Status kód: **200**

- příspěvek byl dle identifikátoru nalezen
- upravený příspěvek byl úspěšně uložen

```json
code: {
    message: 'Příspěvek byl aktualizován.',
    status: 200,
    success: true
},
post: [
    _id : ObjectId("5e5e219d562f9d2abc2a8791"),
    title : "Test videa",
    createdAt : ISODate("2020-03-03T09:21:33.024Z"),
    createdBy : {
        name : "Foldyna Martin",
        email : "martin.foldyna@365.pslib.cz",
        role : "Teacher"
    },
    thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABcQERQRDhcUEhQa..",
    subject : "MME",
    classYear : 3,
    url : "https://www.youtube.com/",
    __v : 0,
    updatedAt : ISODate("2020-03-05T09:01:17.170Z"),
    updatedBy : {
        name : "Martin Foldyna",
        picture : "https://lh3.googleusercontent.com/a-/AOh14GjBTwfgT60PBPGKtHqZ8FCRPO-LaK0RQ1K-DtR5=s96-c",
        email : "martin.foldyna@pslib.cz",
        role : "Teacher",
    }
]
```

**Neúspěšný výstup**

Status kód: **404** 

- Požadované příspěvky nebyly dle kritérí nalezeny

```json
code: {
    message: 'Požadovaný příspěvek nebyl nalezen.',
    status: 404,
    success: false
},
post: null
```

## Uživatel 

*user.ctrl.js + user.routes.js*

*Cesta:* /api/ + **user**

V *user.ctrl.js* se nachází vše spojené s uživatelemi. Jejich nahrávání a odtraňování.

#### Načítání

*Metoda:* GET

*Cesta:* /getAll

**Úspěšný výstup:**

Status kód: **200**

- Uživatelé existují v databázi a byli načteni

```json
code: {
    message: 'Uživatelé byli načteni.',
    status: 200,
    success: true
},
users: [
   {
       _id: "5e59452146f3a471b1584d37"
       email: "martin.foldyna@365.pslib.cz"
       name: "Foldyna Martin"
       state: "authorised"
       role: ["teacher", "admin"]
       __v: 0
   },
   {
       _id: "5e5c0e960ed450b187618508"
       email: "martin.foldyna@pslib.cz"
       name: "Martin Foldyna"
       state: "unauthorised"
       role: "Teacher"
       __v: 0
   }
]
```

**Neúspěšný výstup:**

Status kód: **404**

- Uživatelé existují v databázi a byli načteni

```json
code: {
    message: 'Uživatelé nebyli nalezeni.',
    status: 404,
    success: false    
}
```

#### Odstraňování:

*Metoda:* POST

*Cesta:* /remove/:id

**Vstupní data:**
- parametr id: identifikátor uživatele, který se má odstranit

**Úspěšný výstup:**

Status kód: **200**

- Uživatel byl nalezen a úspěšně smazán

```json
code: {
    message: 'Uživatel byl odstraněn.',
    status: 200,
    success: true
}
```

**Neúspěšný výstup:**

Status kód: **404**

- Uživatel nebyl nalezen

```json
code: {
    message: 'Uživatelé nebyli nalezeni.',
    status: 404,
    success: false    
}
```

## Souhrné (generální) funkce

*general.ctrl.js + general.routes.js*

*Cesta:* /api/ + **general**

V *general.ctrl.js* se nachází funkce, které by se jinak opakovali ve všech kontrollerech, např. odstraňování.

#### Odstraňování

*Metoda:* POST

*Cesta:* /delete/:model/:id

**Vstupní data:**
- parametr model: určí se, ve kterém modelu se bude odstraňovat
- parametr id: identifikátor příspěvku(obrázku), který se má odstranit

**Úspěšný výstup:**

Status kód: **200**

- Odstraňovaný příspěvek existuje v databázi a byli úspěšně smazán

```json
code: {
    message: 'Příspěvek byl odstraněn.',
    status: 200,
    success: true
},
```

**Neúspěšný výstup:**

Status kód: **404**

- Příspěvek nebyl nalezen

```json
code: {
    message: 'Požadovaný příspěvek nebyl nalezen.',
    status: 404,
    success: false   
}
```





