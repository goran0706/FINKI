package _3_interfaces._8_functional_interface;

public class Main {
    public static void main(String[] args) {
        // Implement functional interface using an anonymous class
        FunctionalInterface store = new FunctionalInterface() {
            @Override
            public int get() {
                return 10;
            }
        };
        System.out.println(store.get());

        // Implement functional interface using a lambda expression
        FunctionalInterface st = () -> 10;
        System.out.println(st.get());
    }
}
