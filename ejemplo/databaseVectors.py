import faiss
import numpy as np
import pickle
import os

TOP_K = 3 #Nombre maxim de fragments que volem recuperar
THRESHOLD = 1 # Llindar màxim de distància per considerar una semblança rellevant

class DataBase_Vector:
   # Inicialitzem una base de dades vectorials amb FAISS
   def __init__(self, dim, index_path="faiss_index.bin", metadata_path="metadata.pkl"):
       self.dim = dim  # dimensió dels vectors (ha de coincidir amb l'output del model d'embedding!!!)
       self.index_path = index_path # fitxer on es guardarà l'índex FAISS
       self.metadata_path = metadata_path # fitxer on es guarden els textos originals
       self.index = faiss.IndexFlatL2(dim) # creem l'índex amb distànica euclidiana (L2)
       self.metadata = [] # on guardem els textos originals

    # Afegim vectors i els textos
   def afegir_vectors(self, vectors, texts):
       self.index.add(np.array(vectors)) # afegim els vectors a FAISS (matriu de vectors np.array)
       self.metadata.extend(texts) # guarda la llista de textos associats

    # Guardem l'índex FAISS i els textos associats
   def guardar(self):
       faiss.write_index(self.index, self.index_path)
       with open(self.metadata_path, "wb") as f:
           pickle.dump(self.metadata, f)
       #vector guardat a la base de dades

    # Carrega una base de dades existent, si existeix, i si no, es manté una base de dades nova buida
   def carregar(self):
       if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
           self.index = faiss.read_index(self.index_path)
           with open(self.metadata_path, "rb") as f:
               self.metadata = pickle.load(f)
                #s'ha guardat el vector carregat
        #sino, es crea una nova base de dades

    # Busquem els fragments de text més semblants al vector de pregunta
   def buscar(self, query_vector, top_k=TOP_K, threshold = THRESHOLD): 
       # query_vector = vector d'embedding de la pregunta
       # top_k = nombre de fragments més semblants que volem recuperar
       D, I = self.index.search(np.array([query_vector]), top_k)
       results = []
       for distancia, i in zip(D[0], I[0]):
           if i < len(self.metadata) and distancia < threshold: #nomes afegirem el sfragment si les distancies son bastant prou similars
               results.append(self.metadata[i])
       return results #retornem la llista de textos semblants
