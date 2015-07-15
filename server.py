import SimpleHTTPServer
import SocketServer

PORT = 5000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at localhost", PORT
httpd.serve_forever()
