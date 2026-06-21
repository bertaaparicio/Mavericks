## Enunciado

> En el reto, desarrollarás una solución basada en agentes inteligentes de IA que optimicen el proceso de búsqueda de empleo.
El objetivo es crear un sistema capaz de:
Leer y analizar currículums en PDF, extraer automáticamente habilidades, experiencia y formación.
Cruzar esa información con las vacantes disponibles, que contienen descripciones del puesto y  competencias clasificadas como “Must Have” y “Nice to Have”.
El sistema deberá evaluar la compatibilidad entre candidatos y puestos, generar un ranking de recomendación de las vacantes para un CV, y ofrecer insights sobre las skills que mejorarían el CV.
Tu misión es diseñar una arquitectura modular, escalable y explicable que combine técnicas de prompt engineering, extracción de información y razonamiento con agentes.

## Executar TalentMatch

1. Instal·la les dependències Python amb `py -m pip install -r requirements.txt`.
2. Entra a `frontend` i executa `npm.cmd install`.
3. Compila React amb `npm.cmd run build`.
4. Torna a l'arrel i inicia el servidor amb `py main.py`.
5. Obre `http://localhost:8000` al navegador.

Per desenvolupar el frontend amb recàrrega automàtica, executa
`npm.cmd run dev` dins de `frontend` i mantén també `py main.py` actiu.

La primera versió accepta CVs en PDF o DOCX, n'extreu el text i mostra un
resum del perfil, competències, idiomes i punts clau. Els PDF escanejats sense
text incorporat requeriran una futura capa d'OCR.

Després de l'anàlisi també aplica el checklist de
`backend/config/cv_checklist.json`: Free utilitza la prioritat màxima i PRO
afegeix les prioritats alta i mitjana. Els camps no detectats es mostren com a
preguntes editables per completar el perfil abans del matching.

El pla PRO també rep una auditoria inicial definida a
`backend/config/cv_improvement_checklist.json`, amb recomanacions sobre
resultats quantificats, ATS, elevator pitch, verbs d'acció i futurs skill gaps.

## Portals disponibles

- `/`: homepage amb selecció entre candidat i empresa.
- `/candidate`: càrrega i anàlisi inicial del currículum.
- `/company`: publicació d'ofertes i cursos en el prototip empresarial.

Consulta [ARCHITECTURE.md](ARCHITECTURE.md) per entendre l'organització del
codi i el flux de dades.
