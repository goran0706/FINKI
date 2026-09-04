package lessons._11_design_paterns;

public class SingletonClass {
    private static final SingletonClass instance = new SingletonClass();

    public SingletonClass() {
        int count = 10;
    }

    public static SingletonClass getInstance() {
        return instance;
    }
}

class SingletonClassDemo {
    public static void main(String[] args) {
        var singletonInstance = SingletonClass.getInstance();
    }
}