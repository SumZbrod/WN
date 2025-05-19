from flask import Flask, render_template, jsonify, request, redirect
import json
from parser import make_total_script
app = Flask(__name__, static_folder='static')
import os
# with open('/home/kiki/Downloads/VN_HIGURASHI/Chapter 2. Watanagashi/pymove/data/output/script_test.json') as f:
# with open('data/output/script.json') as f:
#     texts = json.load(f)

batch_size = 20

@app.route('/')
def index():
    script_name = request.args.get('script_name', default='', type=str)
    global_index =  request.args.get('global_index', default=0, type=int)
    if script_name == '':
        return redirect("/menu", code=302)

    return render_template('index.html', script_name=script_name, global_index=global_index)

@app.route('/get_text')
def get_text():
    script_name = request.args.get('script_name', default='', type=str)
    assert script_name != '', "Foeget to send script name"
    global batch_size
    global_index = 1 + request.args.get('global_index', default=0, type=int)
    script_path = os.path.join('static/Scripts', script_name)
    print(script_path)
    print(global_index)
    with open(script_path, encoding='utf-8') as f:
        texts = json.load(f)

    if global_index >= len(texts):  # Проверка на конец списка текстов
        return jsonify([{'global_index':-1}])
    text_batch = texts[global_index: global_index+batch_size]
    return jsonify(text_batch)


@app.route('/menu')
def menu():
    script_path = 'static/Scripts'
    if not os.path.exists(script_path) or os.listdir(script_path):
        # try:
            make_total_script()
        # except Exception as e:
            # return render_template('error.html', error_message=e)


    scripts = sorted(os.listdir(script_path))
    return render_template('menu.html', scripts=scripts)

if __name__ == '__main__':
    app.run(debug=True)
