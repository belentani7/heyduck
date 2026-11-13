import http.server
import socketserver
import os
import threading
import time
import urllib.request

PORT = 8999
DIRECTORY = "/home/ubuntu/duck-producao-musical/dist/public"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_test():
    os.chdir("/home/ubuntu/duck-producao-musical")
    os.system("pnpm build")

    handler = Handler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()

        time.sleep(1)
        try:
            url = f"http://localhost:{PORT}/"
            req = urllib.request.urlopen(url)
            html = req.read().decode('utf-8')
            print(f"STATUS: {req.status}")
            print(f"CONTENT LENGTH: {len(html)}")
            if "<html" in html and "Duck" in html:
                print("TEST PASSED: Static server rendered Duck successfully.")
            else:
                print("TEST FAILED: Unexpected HTML content.")
        except Exception as e:
            print(f"TEST FAILED WITH EXCEPTION: {e}")
        finally:
            httpd.shutdown()

if __name__ == "__main__":
    run_test()
