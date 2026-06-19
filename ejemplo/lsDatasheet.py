import streamlit as st
from gestioPdf import extreure_text_pdf, trossejar_text
from embeddings import model_embedding, generar_embedding
from databaseVectors import DataBase_Vector
from llmInterficie import LLM, resumir_pdf
from PIL import Image
import torch

torch.classes.__path__ = []

MAX_HISTORY = 5  #vol dir que: volem les últimes 5 preguntes i respostes associades
IMAGE_WIDTH = 500 #amplada de la imatge
TOP_K = 3 #numero de fragments que es recuperen per respondre
FRAG_SIZE = 300 #numero de caracters a mostrar per fragment en les referencies

#Diccionari dels textos prque la pagina estigui configurada en diferents idiomes
TEXTOS = {
    "Català":{
        "benvinguda": "Benvingut/da a LSDatasheet!",
        "descripcio": "Amb LSDatasheet podras fer resums dels pdf que vulguis i preguntar tot allò que vulguis.",
        "pujar_pdf": "Puja un PDF",
        "pregunta": "Fes una pregunta sobre el PDF",
        "llegint": "Llegint el PDF...",
        "carregat": "PDF carregat i llegit",
        "error": "No s'ha pogut trobar cap fragment rellevant per respondre la teva pregunta en aquest PDF. Prova amb un altre!",
        "info" : "Creat per 🌟 Berta Aparicio",
        "titol_resum": "**Resum del pdf:**",
        "help_temperatura": "Controla la creativitat de les respostes! Com més gran sigui el valor, més creatives seran. Si prefereixes respostes més segures, busca un valor més baix.",
        "titol_temperatura": "🌈 Temperatura del model LLM",
        "titol_idioma": "🌐 Idioma",
        "help_idioma": "Selecciona l'idioma en què vols les respostes",
        "titol_referencies": "Referències del document",
        "fragment": "Fragment",
        "error_pdf": "El fitxer pujat no és un PDF vàlid"
    },
    "English":{
        "benvinguda": "Welcome to LSDatasheet!",
        "descripcio": "With LSDatasheet you can make summaries of the PDFs you want and ask anything you want.",
        "pujar_pdf": "Upload a PDF",
        "pregunta": "Ask a question about the PDF",
        "llegint": "Reading the PDF...",
        "carregat": "PDF loaded and read",
        "error": "No relevant snippets could be found to answer your question in this PDF. Try with another one!",
        "info" : "Created by 🌟 Berta Aparicio",
        "titol_resum": "**Summary of the pdf:**",
        "help_temperatura": "Controls the creativity of the responses. Higher values are more creative. Lower values give safer answers.",
        "titol_temperatura": "🌈 Temperature of the LLM model",
        "titol_idioma": "🌐 Language",
        "help_idioma": "Select the language in which you want the responses",
        "titol_referencies": "Document references",
        "fragment": "Fragment",
        "error_pdf": "The uploaded file is not a valid PDF"
    },
    "Castellano": {
        "benvinguda": "Bienvenido/da a LSDatasheet!",
        "descripcio": "Con LSDatasheet podras hacer resumenes de los pdf que quieras i preguntar todo aquello que quieras.",
        "pujar_pdf": "Sube un PDF",
        "pregunta": "Haz una pregunta sobre el PDF",
        "llegint": "Leyendo el PDF...",
        "carregat": "PDF cargado i lleído",
        "error": "No se ha podido encontrar ningun fragmento relevante para resolver tu pregunta en este PDF. Prueva con otro!",
        "info" : "Creado por 🌟 Berta Aparicio",
        "titol_resum": "**Resumen del pdf:**",
        "help_temperatura": "Controla la creatividad de las respuestas. Cuanto mayor sea el valor, más creativas serán. Valores bajos dan respuestas más seguras.",
        "titol_temperatura": "🌈 Temperatura del modelo LLM",
        "titol_idioma": "🌐 Idioma",
        "help_idioma": "Selecciona el idioma en el que quieres las respuestas",
        "titol_referencies": "Referencias del documento",
        "fragment": "Fragmento",
        "error_pdf": "El fitxero subido no és un PDF válido"
    }
}

# SideBar
with st.sidebar:
    #OPCIONAL 5: CANVI D'IDIOMA
    default_idioma = "Català"
    idioma = st.selectbox(
        TEXTOS[default_idioma]['titol_idioma'],
        options=["Català", "English", "Castellano"],
        index=0,
        help=TEXTOS[default_idioma]['help_idioma']
    )

    logo = Image.open("logo.png")
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.image(logo, width=IMAGE_WIDTH)
    st.title(TEXTOS[idioma]['benvinguda'])
    st.markdown(f"{TEXTOS[idioma]['descripcio']}")

    # OPCIONAL 2: SLIDER TEMPERATURA
    temperatura = st.sidebar.slider(
        TEXTOS[idioma]['titol_temperatura'],
        min_value=0.0,
        max_value=1.0,
        value=0.7,
        step=0.1,
        help=TEXTOS[idioma]['help_temperatura']
    )

    st.write(TEXTOS[idioma]['info'])


# Títol i pujada de fitxer
st.title(f"💬 {TEXTOS[idioma]['benvinguda']}")
uploaded_file = st.file_uploader(TEXTOS[idioma]['pujar_pdf'], type=["pdf"])

# Historial de la conversa --> important deixar-ho aquí sota el títol
if "messages" not in st.session_state:
    st.session_state.messages = [] #aixo ens permet rescordar les dades quan recarreguem la pagina
    #el st.session_state.messages, és la llista completa del xat

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if uploaded_file and not st.session_state.get("pdf_processed", False):
    if uploaded_file.type != "application/pdf":
        st.error(TEXTOS[idioma]["error_pdf"])
    else:
        with st.spinner(TEXTOS[idioma]['llegint']):
            # Processament del PDF
            text = extreure_text_pdf(uploaded_file)
            if not text.strip():
                st.error("ERROR")
            blocs = trossejar_text(text)

            #fem els embeddings
            model = model_embedding()
            vectors = generar_embedding(blocs, model)

            # Crear la vector DB i afegir-hi els blocs
            dim = vectors.shape[1]
            db = DataBase_Vector(dim)
            db.afegir_vectors(vectors, blocs)

            # guardem el db i el model a la sessió
            st.session_state["db"] = db
            st.session_state["model"] = model
            st.session_state["pdf_processed"] = True
            st.session_state["blocs"] = blocs
            
            # Mostra un petit resum automàtic
            llm = LLM(temperatura=temperatura, idioma=idioma)
            resum = resumir_pdf(blocs, llm)

            st.success(TEXTOS[idioma]['carregat'])

            with st.chat_message("assistant"):
                st.markdown(TEXTOS[idioma]['titol_resum'])
                st.markdown(resum)
            st.session_state.messages.append({"role": "assistant", "content": resum})

        
# si ja s'ha llegit el pdf...
if st.session_state.get("pdf_processed", False):
    db = st.session_state["db"]
    model = st.session_state["model"]
    llm = LLM(temperatura=temperatura, idioma=idioma)

    # Xat amb l'usuari
    if prompt := st.chat_input(TEXTOS[idioma]['pregunta']):
        # mostrem el missatge del usuari
        with st.chat_message("user"):
            st.markdown(prompt)
        st.session_state.messages.append({"role": "user", "content": prompt})

        # generem una resposta
        query_vec = model.encode([prompt])[0]
        fragments_r = db.buscar(query_vec, top_k=TOP_K)

        # printem la resposta, mirant si s'ha trobat una o no
        if not fragments_r:
            # no s'ha trobat res
            with st.chat_message("assistant"):
                st.warning(TEXTOS[idioma]['error'])
            st.session_state.messages.append({"role": "assistant", "content": TEXTOS[idioma]['error']})
        else:
            # sí que s'ha trobat resposta

            #OPCIONAL 3: DOTAR DE MEMORIA AL LLM
            #volem com a màxim les 5 últimes preguntes amb les respostes associades

            PreguntaResposta =[]
            usuari = None

            for msg in st.session_state.messages:
                if msg["role"] == "user":
                    usuari = msg["content"]
                elif msg["role"] == "assistant" and usuari:
                    PreguntaResposta.append((usuari, msg["content"]))
                    usuari = None
            
            #importaant: el negues, pq volem les anteriors (últimes converses)
            ultimes_preguntesresp = PreguntaResposta[-MAX_HISTORY:]

            memoria = ""
            for usu, ass in ultimes_preguntesresp:
                memoria += f"Usuari: {usu}\nAssistent: {ass}\n"
            
            context = (
                f"Historial de conversa anterior:\n"
                f"{memoria.strip()}\n"
                f"Usuari: {prompt}\n\n"
                f"\nFragments del PDF relacionats amb la pregunta:\n"
                + "\n".join(fragments_r)
            )
            resposta = llm.generar_resposta(prompt, context)

            with st.chat_message("assistant"):
                    st.markdown(resposta)
            st.session_state.messages.append({"role": "assistant", "content": resposta})

            #OPCIONAL 1: REFERENCIES
            #per mostrar els fragments de text que s'han fet servir per generar la resposta
            with st.expander(TEXTOS[idioma]["titol_referencies"]):
                for i, frag in enumerate(fragments_r):
                    st.markdown(f"*{TEXTOS[idioma]['fragment']} {i + 1}):* {frag[:FRAG_SIZE]}")