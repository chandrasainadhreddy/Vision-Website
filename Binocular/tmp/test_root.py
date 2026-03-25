import urllib.request
try:
    req = urllib.request.Request("http://127.0.0.1:5000/")
    with urllib.request.urlopen(req) as res:
        print(res.read())
except Exception as e:
    print(e)
