"""Quick database connection test."""

import os

import psycopg2

DB_CONFIG = {
    "host": os.getenv("DB_HOST", ""),
    "database": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "grau"),
    "password": os.getenv("DB_PASSWORD", ""),
    "port": os.getenv("DB_PORT", "5432"),
}

try:
    conexion = psycopg2.connect(**DB_CONFIG)
    cursor = conexion.cursor()

    cursor.execute("SELECT * FROM jobposts LIMIT 5;")
    filas = cursor.fetchall()
    for fila in filas:
        print(fila)

except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")

finally:
    if "conexion" in locals() and conexion:
        cursor.close()
        conexion.close()
