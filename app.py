from flask import Flask, render_template, jsonify
import json

app = Flask(__name__, static_folder='static')

# with open('/home/kiki/Downloads/VN_HIGURASHI/Chapter 2. Watanagashi/pymove/data/output/script_test.json') as f:
with open('data/output/script.json') as f:
    texts = json.load(f)

current_index = 1440  # Индекс для отслеживания текущего текста
batch_size = 20

@app.route('/')
def index():
    return render_template('index.html')
 
@app.route('/get_text')
def get_text():
    global current_index
    global batch_size
    if current_index >= len(texts):  # Проверка на конец списка текстов
        return jsonify([])
    text_batch = texts[current_index: current_index+batch_size]
    print(current_index)
    current_index += batch_size
    return jsonify(text_batch)

if __name__ == '__main__':
    app.run(debug=True)
