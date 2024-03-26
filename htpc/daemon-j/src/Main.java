import de.baum.htpc.daemon.HttpApi;
import de.baum.htpc.daemon.HttpServer;

public class Main {
    public static void main(String[] args) {
        HttpServer httpServer = new HttpServer();
        new HttpApi(httpServer);
    }
}
