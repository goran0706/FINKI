package lessons._2_classes;

public class AbstractClass {
    public static void main(String[] args) {
        // ElectronicDevice device = new ElectronicDevice(); // Abstract - cannot be instantiated
        ElectronicDevice tv = new Television();
        tv.turnOn();
        tv.turnOff();
        tv.turnOn();
        tv.increaseVolume();
        tv.increaseVolume();
        tv.increaseVolume();
        tv.increaseVolume();
        tv.decreaseVolume();
    }
}

abstract class ElectronicDevice {
    public abstract void turnOn();
    public abstract void turnOff();

    public void increaseVolume() {
        System.out.println("+1");
    }

    public void decreaseVolume() {
        System.out.println("-1");
    }
}

class Television extends ElectronicDevice {

    @Override
    public void turnOn() {
        System.out.println("Television is ON...");
    }

    @Override
    public void turnOff() {
        System.out.println("Television is OFF...");
    }
}