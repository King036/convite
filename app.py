import os
import psycopg2
from flask import Flask,render_template ,jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('convite.html')


def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("dpg-d7jcgk57vvec738s275g-a"),
        database=os.environ.get("convite_skn0"),
        user=os.environ.get("convite_skn0_user"),
        password=os.environ.get("DubGmVGAiMP8QYkHcTGODKVQxlc65UCw"),
        port=os.environ.get("DB_PORT", 5432)
    )
    return conn
def BancodeDados():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS presencas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        presenca VARCHAR(50)
    );
    """)
    print('banco criado')
    conn.commit()

    cur.close()
    conn.close()
BancodeDados()





if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)