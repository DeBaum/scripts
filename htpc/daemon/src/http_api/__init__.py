from http.server import HTTPServer

import api_handler.HttpAPIHandler

def setup():
  httpServer = HTTPServer(('0.0.0.0', 5001), HttpAPIHandler)
  httpServer.serve_forever()
