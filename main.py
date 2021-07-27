from flask import Flask, render_template, redirect, make_response, send_from_directory

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/offline')
def offline():
    return render_template('offline.html')

@app.route('/service-worker.js')
def sw():
    response = make_response(send_from_directory('static', 'service-worker.js'))
    response.headers['Cache-Control'] = 'no-cache'
    return response

@app.route('/manifest.json')
def manifest():
     return app.send_from_directory('static', 'manifest.json')
    
if __name__ == '__main__':
    app.debug = True
    app.run()