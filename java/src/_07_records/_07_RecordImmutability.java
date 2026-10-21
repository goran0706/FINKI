package _07_records;

public class _07_RecordImmutability {

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice");

        System.out.println(employee.id());
        System.out.println(employee.name());

        // Compilation error: record components cannot be reassigned.
        // employee.name = "Bob";

        // Records do not provide setters.
        // employee.setName("Bob");

        // To represent different data, create a new record instance.
        Employee updatedEmployee = new Employee(employee.id(), "Bob");

        System.out.println(updatedEmployee.name()); // Bob
        System.out.println(employee.name());        // Alice
    }

    // Record components are final, so their references cannot be reassigned
    // after the record has been constructed.
    record Employee(String id, String name) {
    }
}