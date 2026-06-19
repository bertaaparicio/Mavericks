## Enunciado

> En el reto, desarrollarás una solución basada en agentes inteligentes de IA que optimicen el proceso de búsqueda de empleo.
El objetivo es crear un sistema capaz de:
Leer y analizar currículums en PDF, extraer automáticamente habilidades, experiencia y formación.
Cruzar esa información con las vacantes disponibles, que contienen descripciones del puesto y  competencias clasificadas como “Must Have” y “Nice to Have”.
El sistema deberá evaluar la compatibilidad entre candidatos y puestos, generar un ranking de recomendación de las vacantes para un CV, y ofrecer insights sobre las skills que mejorarían el CV.
Tu misión es diseñar una arquitectura modular, escalable y explicable que combine técnicas de prompt engineering, extracción de información y razonamiento con agentes.

## Executar TalentMatch

1. Instal·la les dependències amb `pip install -r requirements.txt`.
2. Inicia el servidor amb `python main.py`.
3. Obre `http://localhost:8000` al navegador.

La primera versió accepta CVs en PDF o DOCX, n'extreu el text i mostra un
resum del perfil, competències, idiomes i punts clau. Els PDF escanejats sense
text incorporat requeriran una futura capa d'OCR.

## Portals disponibles

- `/`: homepage amb selecció entre candidat i empresa.
- `/candidate`: càrrega i anàlisi inicial del currículum.
- `/company`: publicació d'ofertes i cursos en el prototip empresarial.

Consulta [ARCHITECTURE.md](ARCHITECTURE.md) per entendre l'organització del
codi i el flux de dades.
