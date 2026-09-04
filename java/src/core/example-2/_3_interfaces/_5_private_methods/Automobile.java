package _3_interfaces._5_private_methods;

public interface Automobile {
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

    private void setUp() {
        System.out.println("Toggle Brakes...");
        System.out.println("Toggle Engine Pump...");
        System.out.println("Toggle Hydraulics...");
    }
}
