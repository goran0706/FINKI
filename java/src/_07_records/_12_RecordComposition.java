package _07_records;

public class _12_RecordComposition {

    static void main(String[] args) {

        Address address = new Address(
                "Main Street 10",
                "Tetovo",
                "North Macedonia"
        );

        Department department = new Department("D001", "Engineering");

        Employee employee = new Employee(
                "E001",
                "Alice",
                address,
                department
        );

        // Access components of the Employee record.
        System.out.println(employee.id());
        System.out.println(employee.name());

        // Access components of nested records through their accessors.
        System.out.println(employee.address().city());
        System.out.println(employee.department().name());

        // The generated toString() represents nested records as well.
        System.out.println(employee);
    }

    // Records can contain other objects as components.
    // This allows complex data structures to be built by composing
    // smaller, independently reusable types.
    record Address(String street, String city, String country) {
    }

    record Department(String id, String name) {
    }

    record Employee(String id, String name, Address address, Department department) {
    }
}