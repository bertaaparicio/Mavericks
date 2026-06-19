# Arquitectura de TalentMatch AI

Aquest document explica on viu cada part del projecte i quina responsabilitat
té. La regla general és que una peça només hauria de canviar per un motiu.

## Estructura

```text
Mavericks/
├── main.py                         # Punt d'entrada: arrenca el servidor
├── backend/
│   ├── server.py                   # Rutes HTTP, fitxers estàtics i API
│   └── services/
│       └── cv_reader.py            # Extracció i anàlisi de PDF/DOCX
├── frontend/                        # Aplicació React creada amb Vite
│   ├── index.html                   # Document base on React es munta
│   ├── package.json                 # Scripts i dependències Node
│   ├── public/images/               # Imatges estàtiques de l'usuari
│   └── src/
│       ├── components/              # Header, footer, logo i targetes
│       ├── context/                 # Estat compartit de l'idioma
│       ├── pages/                   # Home, candidat i empresa
│       ├── services/                # Comunicació amb l'API Python
│       └── styles/                  # Sistema visual global
├── ejemplo/                        # Codi de referència original
└── requirements.txt                # Dependències Python
```

## Flux de candidat

1. L'usuari entra a `/candidate`.
2. `CandidatePage.jsx` valida el PDF o DOCX al navegador.
3. El fitxer s'envia a `POST /api/analyze`.
4. `backend/server.py` interpreta el formulari.
5. `cv_reader.py` extreu el text i retorna dades estructurades.
6. El frontend mostra el resum, punts clau i text detectat.

## Flux d'empresa

1. L'usuari entra a `/company`.
2. Pot crear una oferta o una formació.
3. El prototip desa els últims elements a `localStorage`.
4. En una fase posterior, `CompanyPage.jsx` enviarà aquests formularis a una API i
   una base de dades sense necessitat de redissenyar la pàgina.

## Idiomes

Cada portal té el seu diccionari perquè els seus textos i necessitats són
diferents. Tots comparteixen la clau `talentmatch-language` de `localStorage`,
de manera que l'idioma seleccionat es conserva en navegar entre portals.

## Ampliacions previstes

- Afegir docTR o un altre OCR per a PDF escanejats.
- Afegir el checklist intern del perfil i el chatbot de preguntes pendents.
- Crear API i base de dades per a ofertes, cursos i empreses.
- Afegir autenticació separada per candidat i empresa.
- Connectar el motor de matching i la seva explicació.
