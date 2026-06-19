import psycopg2

try:
    # 1. Establecer la conexión
    conexion = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="12345",
        port="5432"
    )
    
    cursor = conexion.cursor()

    # 2. Lanzar la consulta
    consulta_sql = "SELECT * FROM jobposts LIMIT 5;"
    cursor.execute(consulta_sql)

    # 3. Obtener y mostrar los resultados
    filas = cursor.fetchall()
    for fila in filas:
        print(fila)

except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")

finally:
    # 4. Cerrar la conexión
    if 'conexion' in locals() and conexion:
        cursor.close()
        conexion.close()