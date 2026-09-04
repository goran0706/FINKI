package _3_interfaces._4_default_methods;

public class Car implements Automobile {

    @Override
    public void startEngine() {
        System.out.println("Engine started!");
    }

    @Override
    public void stopEngine() {
        System.out.println("Engine stopped!");
    }
}
