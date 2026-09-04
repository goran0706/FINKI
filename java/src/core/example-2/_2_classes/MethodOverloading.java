package _2_classes;

public class MethodOverloading {
    public static void main(String[] args) {
        printHello();
        printHello("John");
        printHello("John", "Doe");

        add(5, 5);
        add(5.50, 5.50);
    }

    private static void printHello() {
        System.out.println("Hello World");
    }

    private static void printHello(String name) {
        System.out.println("Hello " + name);
    }

    private static void printHello(String name, String surname) {
        System.out.println("Hello " + name + " " + surname);
    }

    private static void add(int a, int b) {
        int sum = a + b;
        System.out.println(sum);
    }

    private static void add(double a, double b) {
        double sum = a + b;
        System.out.println(sum);
    }
}
