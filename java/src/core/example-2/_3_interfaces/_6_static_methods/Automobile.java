package _3_interfaces._6_static_methods;

public interface Automobile {
    static void setUp() {
        System.out.println("Toggle Brakes...");
        System.out.println("Toggle Engine Pump...");
        System.out.println("Toggle Hydraulics...");
    }

    default void startEngine() {
        setUp();
        System.out.println("Engine started!");
    }

    default void stopEngine() {
        setUp();
        System.out.println("Engine stopped!");
    }

    default void horn() {
        System.out.println("Beep beep");
    }
}
