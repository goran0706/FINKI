package _2_classes;

public class ObjectsAsArguments {
    static int personCount;

    public static void main(String[] args) {
        Person p = new Person("John");
        printPersonName(p);
    }

    private static void printPersonName(Person p) {
        System.out.println(p.name);
        System.out.println(personCount);
    }

    // An inner class can also be static, which means that you can access it without creating an object of the outer class.
    // Static class in Java is a nested class, and it doesn't need the reference of the outer class.
    // Static class can access only the static members of its outer class.
    // Static class cannot access the non-static member of the outer classes.
    // Inner classes can access the static and the non-static members of the outer class.
    static class Person {
        String name;

        Person() {
        }

        Person(String name) {
            this.name = name;
            personCount++;
        }
    }
}
