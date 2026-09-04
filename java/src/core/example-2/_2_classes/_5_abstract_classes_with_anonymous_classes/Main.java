package _2_classes._5_abstract_classes_with_anonymous_classes;

public class Main {
    public static void main(String[] args) {
        AbstractClass ac = new AbstractClass() {
            @Override
            void greet() {
                System.out.println("Inside an anonymous class extending an abstract class.");
            }

            @Override
            void printMessage(String message) {
                System.out.println(message);
            }
        };

        ac.greet();
    }
}
