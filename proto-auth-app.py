from flask import Flask, request, jsonify

app = Flask(__name__)

valid_username = "user123"
valid_password = "pass123"

@app.route('/')
def home():
    return "Please log in by sending a POST request with your username and password."

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == valid_username and password == valid_password:
        return jsonify({"message": "Access Granted. Welcome!"}), 200
    else:
        return jsonify({"message": "Access Denied. Invalid username or password."}), 401

@app.route('/protected')
def protected():
    auth = request.authorization
    if auth and auth.username == valid_username and auth.password == valid_password:
        return jsonify({"message": "This is a protected endpoint!"})
    return jsonify({"message": "Access Denied. Invalid credentials."}), 401

if __name__ == '__main__':
    app.run(debug=True)
