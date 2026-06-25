"""Punt d'entrada únic per executar TalentMatch AI.

Mantenim aquest fitxer petit expressament. L'aplicació arrenca el servidor FastAPI mitjançant:

    python main.py
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        app_dir="backend",
    )
