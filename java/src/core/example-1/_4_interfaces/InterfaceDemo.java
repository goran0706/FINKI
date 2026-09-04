package lessons._4_interfaces;

public class InterfaceDemo {
    public static void main(String[] args) {

        // We cannot instantiate an interface
        // But we can use it with an anonymous class
        Store store = new Store() {
            @Override
            public void put() {
                System.out.println("Putting...");
            }

            @Override
            public int get() {
                return 10;
            }
        };

        store.put();
        store.get();
    }

    interface Store {
        void put();

        int get();
    }
}
