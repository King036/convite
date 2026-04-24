import os
import psycopg2
from flask import Flask,render_template ,jsonify,request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('convite.html')


def get_db_connection():
    conn = psycopg2.connect(os.environ.get("DATABASE_URL"))
    '''conn = psycopg2.connect(
        host=os.environ.get("dpg-d7jcgk57vvec738s275g-a"),
        database=os.environ.get("convite_skn0"),
        user=os.environ.get("convite_skn0_user"),
        password=os.environ.get("DubGmVGAiMP8QYkHcTGODKVQxlc65UCw"),
        port=os.environ.get("DB_PORT", 5432)
    )'''
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

@app.route('/salvar', methods=['POST'])
def salvar():
   
    dados = request.json
    nome = dados.get('nome')
    presenca = dados.get('presenca')


    print(nome)  # aqui você salva no banco depois

    print(presenca)
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("INSERT INTO tabela presencas VALUES (%s,%s)", (nome,presenca))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"status": "ok"})



@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    conn = psycopg2.connect(
        dbname="seubanco",
        user="usuario",
        password="senha",
        host="localhost"
    )
    cur = conn.cursor()

    cur.execute("SELECT id, nome FROM tabela")
    dados = cur.fetchall()

    usuarios = []
    for linha in dados:
        usuarios.append({
            "id": linha[0],
            "nome": linha[1]
        })

    cur.close()
    conn.close()

    return jsonify(usuarios)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)