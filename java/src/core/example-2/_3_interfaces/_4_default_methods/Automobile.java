package _3_interfaces._4_default_methods;

public interface Automobile {
    void startEngine();

    void stopEngine();

    default void horn() {
        System.out.println("Beep beep");
    }
}
