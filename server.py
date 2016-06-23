# HTTP Server for tests.

import os
import sys
import BaseHTTPServer
import SocketServer
import urlparse

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    homedir = ''
    known_content = {   '.htm':   'html',   '.html':  'html', 
                        '.css':   'css',    '.js':    'javascript'  }

    def _set_headers(self, content_type):
        self.send_response(200)
        self.send_header('Content-type', 'text/'+content_type)
        self.end_headers()

    def do_HEAD(self):
        self._set_headers('html')

    def do_GET(self):
        path = urlparse.urlparse(self.path).path
        fname, fext = os.path.splitext(path)
        if fext in MyHandler.known_content:
            self._set_headers(MyHandler.known_content[fext])
            try:
                with open(unicode(os.path.join(MyHandler.homedir, os.path.basename(path))), "r") as f:
                    self.wfile.write(f.read())
            except:
                pass

    def do_POST(self):
        pass # ffu



class MyServer(object):
    def __init__(self, homedir, port):
        MyHandler.homedir = homedir
        self._port = port
        self._httpd = SocketServer.TCPServer(("", port), MyHandler)

    def run(self):
        self._httpd.serve_forever()


def main():
    root = os.getcwd()
    port = 8123 if len(sys.argv) == 1 else int(sys.argv[1])
    server = MyServer(root, port)
    print 'running....'
    print '\t Root: ', root
    print '\t Port: ', port
    server.run()


if __name__ == '__main__':
    main()
