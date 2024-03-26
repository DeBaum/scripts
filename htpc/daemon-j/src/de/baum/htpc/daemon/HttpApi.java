package de.baum.htpc.daemon;

public class HttpApi {
	public HttpApi(HttpServer httpServer) {
		httpServer.addEndpoint("GET", "/api", (path, headers, body) -> this.apiVersion());
		httpServer.addEndpoint("GET", "/power/shutdown", (path, headers, body) -> this.shutdown());
	}

	private String apiVersion() {
		return """
      {
        "version": 1
      }""";
	}

	private String shutdown() {
		return """
			{
				"action": "shutdown",
				"success": true
			}""";
	}
}
