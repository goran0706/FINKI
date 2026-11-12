package aud.aud_00_java_intro;

interface VendingMachine<T> {
    void insertItem(T item);

    T dispenseItem();
}

class CoffeeVendingMachine<T> implements VendingMachine<T> {
    T item;

    public CoffeeVendingMachine() {
        this.item = null;
    }

    @Override
    public void insertItem(T item) {
        this.item = item;
    }

    @Override
    public T dispenseItem() {
        return item;
    }
}

class TeaVendingMachine<T> implements VendingMachine<T> {
    T item;
    Integer counter;

    public TeaVendingMachine() {
        this.item = null;
        this.counter = 0;
    }

    @Override
    public void insertItem(T item) {
        this.item = item;
        this.counter++;
    }

    @Override
    public T dispenseItem() {
        return item;
    }
}

record Container<T>(T object) {
}

public class Example2 {

    static void main() {
        // ==============================================
        // Terminology clarification:
        // ==============================================
        // - Inheritance: IS-A relationship.
        // - Composition/Aggregation: HAS-A relationship.
        // - Interface: Defines a contract that a class promises to implement.

        // ==============================================
        // 1) Why not use an abstract class (IS-A)?
        // ==============================================
        // Using an abstract class implementation is perfectly valid.
        // - However, we should ask: "Does every vending machine need to share some common state or implementation?"
        // - The abstract class will provide both a contract and shared implementation/state.
        // - If we only need to define what a vending machine must do, an interface is usually a better fit.

        // ==============================================
        // 2) Why not use aggregation (HAS-A)?
        // ==============================================
        // Aggregation means one object contains or references another object.
        // Because a coffee vending machine isn't supposed to HAVE-A vending machine. It IS-A vending machine.
        // A vending machine might HAVE-A payment processor, inventory, or cooling system. But it IS-A vending machine.

        // ==============================================
        // 3) Why use an interface instead?
        // ==============================================
        // "Any class that implements VendingMachine must provide these two methods."
        //
        // * Less coupling - Programming against an abstraction rather than a concrete implementation.
        // * Multiple interfaces - Java allows a class to extend only one class, but it can implement multiple interfaces.
        // * Different classes can implement the same interface
        // * An interface doesn't require shared state - An interface is particularly suitable when you want
        //   to describe capabilities or behavior without requiring a shared instance state or implementation.
        // * The most important design principle - There is a principle in OOP called Program to an interface, not an implementation.
        //
        // - Coffee and tea vending machines ARE vending machines.
        // - You want to define common behavior, not shared state.
        // - You want implementations to remain independent.
        // - You may want classes to implement additional interfaces.
        // - You want other parts of your application to depend on the VendingMachine abstraction rather than specific vending machine classes.

        Container<String> stringContainer = new Container<>("Hello World!");
        Container<Integer> integerContainer = new Container<>(10);
        System.out.println(stringContainer.object());
        System.out.println(integerContainer.object());

        CoffeeVendingMachine<String> coffeeVendingMachine = new CoffeeVendingMachine<>();
        coffeeVendingMachine.insertItem("Black Coffee");
        System.out.println(coffeeVendingMachine.dispenseItem());

        TeaVendingMachine<String> teaVendingMachine = new TeaVendingMachine<>();
        teaVendingMachine.insertItem("Green Tea");
        System.out.println(teaVendingMachine.dispenseItem());
    }
}
