package _08_generics;

/*
 * BOUNDED TYPE PARAMETERS WITH INTERFACES
 *
 * A type parameter can be bounded by an interface.
 *
 * Syntax:
 *     <T extends SomeInterface>
 *
 * Even though the keyword is "extends", T can be any type that implements
 * the specified interface.
 *
 * The bound guarantees that T provides the methods declared by the interface.
 */
public class _07_BoundedTypeParametersWithInterfaces {

    // T must implement Identifiable, so getId() is guaranteed to exist.
    public static <T extends Identifiable> void printId(T item) {
        System.out.println(item.id());
    }

    static void main(String[] args) {

        Employee employee = new Employee("EMP-001", "Alex");
        BankAccount account = new BankAccount("ACC-001", 1500.00);

        printId(employee);
        printId(account);

        // Compilation error: String does not implement Identifiable.
        // printId("EMP-001");
    }

    interface Identifiable {
        String id();
    }

    record Employee(String id, String name) implements Identifiable {

    }

    record BankAccount(String id, double balance) implements Identifiable {

    }
}