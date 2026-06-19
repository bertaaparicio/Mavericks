from sentence_transformers import SentenceTransformer
import numpy as np

# Creem i retornem el model d'embedding (per convertir el text en vectors semàntics)

def model_embedding():
   #triem un model que sigui capaç d'entendre preguntes i blocs en idiomes diferents per igualar-los semànticament
   model = SentenceTransformer('distiluse-base-multilingual-cased-v2')
   return model

# Generem embeddings per la llista de fragments del text
def generar_embedding(blocs_text, model):
   # blocs_text = llista d'estring, osigui els fragments del PDF
   # model = el model SentenceTransformer carregat previament
   vectors = model.encode(blocs_text, show_progress_bar=True)
   return np.array(vectors) # retornem una matriu de vectors