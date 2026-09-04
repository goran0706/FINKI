package lessons._11_design_paterns;

// The singleton design pattern details a class implementation that can be instantiated only once.
// Any modification of the object will result in another new immutable object.


public class DBConfigSingleton {
    private static final DBConfigSingleton instance = new DBConfigSingleton();
    private final String hostName;
    private final String dbName;

    public DBConfigSingleton() {
        hostName = "host.example.com";
        dbName = "myDb";
    }

    public static DBConfigSingleton getInstance() {
        return instance;
    }

    @Override
    public String toString() {
        return "DBConfigSingleton { " +
                "hostName='" + hostName + '\'' +
                ", dbName='" + dbName + '\'' +
                " } ";
    }
}

class DBConfigSingletonDemo {
    public static void main(String[] args) {
        DBConfigSingleton config = DBConfigSingleton.getInstance();
        System.out.println(config);
    }
}