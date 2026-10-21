package _07_records;

public class _01_BasicRecord {

    static void main(String[] args) {

        // Create a record instance using its automatically generated constructor.
        Employee employee = new Employee("E001", "Alice", "Engineering");

        // Access record components using their accessor methods.
        System.out.println(employee.id());
        System.out.println(employee.name());
        System.out.println(employee.department());

        // Records automatically provide a readable string representation.
        System.out.println(employee);

        // Records automatically compare their component values.
        Employee anotherEmployee = new Employee("E001", "Alice", "Engineering");

        System.out.println(employee.equals(anotherEmployee)); // true

        // Different component values produce unequal records.
        Employee differentEmployee = new Employee("E002", "Bob", "Finance");

        System.out.println(employee.equals(differentEmployee)); // false
    }

    // A record is a special kind of class designed to represent data.
    //
    // The record declaration automatically provides:
    // - A private final field for each component.
    // - A public accessor method for each component.
    // - A constructor that accepts all components.
    // - An implementation of toString().
    // - An implementation of equals().
    // - An implementation of hashCode().
    //
    // Records are useful when an object primarily carries data rather than
    // maintaining mutable state or implementing complex behavior.
    record Employee(String id, String name, String department) {
    }
}