"""Punt d'entrada únic per executar TalentMatch AI.

Mantenim aquest fitxer petit expressament. Tot el servidor viu al paquet
``backend`` i, per tant, l'aplicació continua arrencant amb una ordre senzilla:

    python main.py
"""

from backend.server import run


if __name__ == "__main__":
    run()
