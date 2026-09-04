package lessons;

public class _16_initializationBlocks {

    public static void main(String[] args) {
        System.out.println(Person.personCount); // Line A
        Person p = new Person(); // Line B
        System.out.println(Person.personCount); // Line C
        Person.personCount = 100; // Line D
        p = new Person(); // Line E
        System.out.println(Person.personCount); // Line F
    }
}

class Car {
    static int carCount;

    // Static Initialization block
    static {
        carCount = 0;
    }

    //<Type> name;
    String color;
    String type;
    int serialNumber;

    // Initialization block
    {
        color = "Blue";
    }

    // Initialization block
    {
        color = "Blue";
    }

    void start() {
        System.out.println("Get Started!");
    }

    void printDescription() {
        System.out.println("This is a " + color + " " + type);
    }

    String getDescription() {
        String desc = "This is a " + color + " " + type;
        return desc;
    }

    // The return type void means nothing is returned from this method
    // The return statement terminates a method, so no code belongs after the return statement.
}

class Person {
    static int personCount = 1000;

    static {
        personCount = 20;
    }

    static {
        personCount = 40;
    }

    {
        personCount = 10;
    }

    {
        personCount = 30;
    }
}

