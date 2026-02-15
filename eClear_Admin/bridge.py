from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/sync', methods=['POST'])
def sync():
    key = request.json.get('key')
    # This runs: python sync_tix.py [your_key]
    result = subprocess.Popen(['python', 'sync_tix.py', key], shell=True)
    return jsonify({"status": "Started", "pid": result.pid})

if __name__ == '__main__':
    app.run(port=5000)