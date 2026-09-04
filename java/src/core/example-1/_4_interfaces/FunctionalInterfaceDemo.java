package lessons._4_interfaces;

public class FunctionalInterfaceDemo {
    public static void main(String[] args) {

        // Implement functional interface using an anonymous class
        Store store = new Store() {
            @Override
            public int get() {
                return 10;
            }
        };
        System.out.println(store.get());

        // Implement functional interface using a lambda expression
        Store st = () -> 10;
        System.out.println(st.get());

    }

    // Functional Interface has only a single abstract method
    @FunctionalInterface
    interface Store {
        int get();
    }
}
