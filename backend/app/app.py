from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chat')
def home():
    return "Hello, World!"

@app.route('/queries')
def queries():
    return "Queries endpoint"

@app.route('/recommendations')
def recommendations():
    return "Recommendations endpoint"

if __name__ == '__main__':
    app.run(debug=True)