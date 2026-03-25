import psutil
try:
    p = psutil.Process(16800)
    print("CWD:", p.cwd())
    print("CMD:", p.cmdline())
except Exception as e:
    print(e)
