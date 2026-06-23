from PyPDF2 import PdfReader
import sys

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text + "\n"
    return full_text.strip()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python tu_archivo.py <ruta_al_pdf>")
        sys.exit(1)
    
    ruta_pdf = sys.argv[1]
    resultado = extract_text_from_pdf(ruta_pdf)
    print(resultado)