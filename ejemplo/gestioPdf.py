from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter

CHUNK_SIZE = 500  #Mida màxima de cada fragment 
CHUNK_OVERLAP = 100 #Numero de caràcters que es solapen entre fragments consecutius

# Extreiem tot el text del PDF a una sola string
def extreure_text_pdf (pdf_path):
   reader = PdfReader(pdf_path) #carreguem el PDF
   full_text = ""
   for page in reader.pages:
       text = page.extract_text() #extreiem el text de cada pàgina
       if text:
        full_text += text + "\n" #l'afegim al text complet
   return full_text 


# Dividim el text en trossos més petits
def trossejar_text (text):
   splitter = CharacterTextSplitter(
       separator = " ", #separador entre paraules
       chunk_size = CHUNK_SIZE, # mida del bloc, num max de chars per fragment
       chunk_overlap = CHUNK_OVERLAP # solapament, num de chars que es repeteixen entre blocs consecutius
       # serveix per no tallar info important per la meitat
   )
   return splitter.split_text(text) # retornem una llista de fragments de text