package lessons._2_classes;

import lessons._1_oop.entities.Animal;

public class AnonymousClass {
    public static void main(String[] args) {

        // Abstract classes cannot be initialized
        // Extending an abstract class we can create an anonymous class
        ElectronicDevice mobile = new ElectronicDevice() {

            @Override
            public void turnOn() {

            }

            @Override
            public void turnOff() {

            }
        };

        mobile.decreaseVolume();
    }
}
