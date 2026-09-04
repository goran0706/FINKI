package _2_classes._3_abstract_classes;

public class Main {
    public static void main(String[] args) {
        AbstractClass a = new AbstractClass() {
            @Override
            void greeting() {
                System.out.println("Hello from abstract class");
            }
        };
        a.greeting();
        a.printHello();
    }
}
