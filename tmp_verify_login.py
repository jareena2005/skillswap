import json
import urllib.request
import urllib.error


data = json.dumps({'username': 'bad', 'password': 'bad'}).encode()
req = urllib.request.Request('http://127.0.0.1:8000/api/token/', data=data, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('HTTP', e.code)
    print(e.read().decode())
except Exception as e:
    print(type(e).__name__, e)
