import requests

MAX_CHARS = 1000 #Nombre màxim de caràcters pel resum inicial
TEMPERATURE = 0.7 #per controlar la creativitat del model
MAX_TOKENS = 500 #nombre màxim de tokens de la resposta generada
BLOC_SIZE = 10 #nombre de blocs a agafar per fer el resum inicial

TEXTOS = {
    "Català": {
        "error": "El document està buit!",
        "resum_inicial": "Benvingut/da a LSDatasheet!",
        "resum_final": "Estic encantat de poder ajudar-te. Pregunta'm tot el que necessitis! 🌞"
    },
    "English": {
        "error": "The document is empty!",
        "resum_inicial": "Welcome to LSDatasheet!",
        "resum_final": "I am really happy to help you. Ask me anything you need! 🌞"
    },
    "Castellano": {
        "error": "El documento esta vacío!",
        "resum_inicial": "Bienvenido/da a LSDatasheet!",
        "resum_final": "Estoy encantado de poder ayudarte. Preguntame todo lo que necesites! 🌞"
    }
}

class LLM:
   # Inicialitzem el model de llenguatge LLM
   def __init__(self, model_id="mistral", temperatura=TEMPERATURE, idioma="Català"):
       self.model_id = model_id
       self.temperatura = temperatura 
       # temp baixa (0.0 - 0.3): respostes més segures però repetitives
       # temp alta (0.7 - 1.0): respostes més creatives i variades
       self.idioma = idioma

    # Generem una resposta a partir de la pregunta i un context
   def generar_resposta(self, instruccio, context, max_new_tokens=MAX_TOKENS):
       # context = text rellevantt extret del PDF
       # max_lenght = long max de la resposta generada
       
       prompt = (
           f"{context.strip()}\n\n"
           f"Ara respon a la següent pregunta en {self.idioma}"
           f"encara que el document estigui en un altre idioma."
           f"i sense repetir cap part del context anterior:\n{instruccio.strip()}"
       )
       response = requests.post( #enviem una petició al servidor local d'Ollama
           "http://localhost:11434/api/generate", #11434 ja que es el port predeterminat per l'API d'Ollama
           json={   #Això és com dir-li que el que estas enviant a la API, per aixo s'envien tots els parametres
               "model": self.model_id,
               "prompt": prompt,
               "temperature": self.temperatura,
               "stream": False
           }
       )
       resposta = response.json()["response"]
       return resposta.strip() # retornem una resposta generada per el LLM
   
# Funció per generar un resum inicial del PDF
def resumir_pdf(blocs_text, llm, max_chars=MAX_CHARS):
    if not blocs_text:
        return TEXTOS[llm.idioma]['error']

    context = "\n".join(blocs_text[:BLOC_SIZE])[:max_chars] #Fem el resum inicial amb els 4 primers blocs

    instruccio = (
        f"Resumeix el contingut del pdf en {llm.idioma} "
        f"encara que el document estigui en un altre idioma."
        f"Digues quin es el tema principal del fitxer i els objectius que te:"
    )
    resum = llm.generar_resposta(instruccio, context) # Generem la resposta del resum inicial
    resposta_final = (
        f"{TEXTOS[llm.idioma]['resum_inicial']}\n"
        f"{resum.strip()}\n\n"
        f"{TEXTOS[llm.idioma]['resum_final']}"
    ) 
    return resposta_final
           
