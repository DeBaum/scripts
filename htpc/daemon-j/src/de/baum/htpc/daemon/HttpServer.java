package de.baum.htpc.daemon;

import com.sun.net.httpserver.*;
import com.sun.net.httpserver.spi.HttpServerProvider;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class HttpServer {
	private final List<HttpEndpoint> endpoints = new ArrayList<>();

	public HttpServer() {
		try {
			HttpServerProvider provider = HttpServerProvider.provider();
			com.sun.net.httpserver.HttpServer server = provider.createHttpServer(new InetSocketAddress(5001), 8);
			server.start();
			HttpContext context = server.createContext("/");
			context.setHandler(routeRequest());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public void addEndpoint(String method, String path, EndpointHandler handler) {
		endpoints.add(new HttpEndpoint(method, path, handler));
	}

	private HttpHandler routeRequest() {
		return exchange -> {
			exchange.getResponseHeaders().add("Content-Type", "application/json");

			var method = exchange.getRequestMethod();
			var path = exchange.getRequestURI().getPath();
			var headers = exchange.getRequestHeaders();
			var body = bodyToString(exchange.getRequestBody());

			var match = endpoints
					.stream()
					.filter(e -> e.method.equals(method))
					.filter(e -> e.path.equals(path) || (e.path + "/").equals(path))
					.findFirst();

			if (match.isEmpty()) {
				exchange.sendResponseHeaders(500, 0);
				exchange.getResponseBody().close();
				return;
			}

			var bytes = match.get().handler.handle(path, headers, body).getBytes();

			exchange.sendResponseHeaders(200, bytes.length);
			exchange.getResponseBody().write(bytes);
		};
	}

	// ==============================
	// = HELPERS ====================
	// ==============================

	private String bodyToString(InputStream stream) throws IOException {
		int bufferSize = 1024;
		char[] buffer = new char[bufferSize];
		StringBuilder out = new StringBuilder();
		Reader in = new InputStreamReader(stream, StandardCharsets.UTF_8);
		for (int numRead; (numRead = in.read(buffer, 0, buffer.length)) > 0; ) {
			out.append(buffer, 0, numRead);
		}
		return out.toString();
	}

	public interface EndpointHandler {
		String handle(String path, Headers headers, String body);
	}

	record HttpEndpoint(String method, String path, EndpointHandler handler) { }
}
