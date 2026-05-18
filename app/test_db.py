from app.database.db import engine

try:
    connection = engine.connect()
    print("Neon Database Connected Successfully!")
    connection.close()
except Exception as e:
    print("Database Error:", e)