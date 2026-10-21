package _07_records;

public class _04_CompactConstructor {

    static void main(String[] args) {

        Employee employee = new Employee("E001", " Alice ", 30);

        System.out.println(employee.id());
        System.out.println(employee.name()); // Alice
        System.out.println(employee.age());

        // Invalid data causes the constructor to throw an exception.
        // Employee invalidEmployee = new Employee("", "Bob", 17);
    }

    // A compact constructor allows validation or normalization of record
    // components without explicitly declaring constructor parameters
    // or assigning values to the record's fields.
    //
    // Java implicitly assigns the constructor parameters to the components
    // after the compact constructor finishes successfully.
    record Employee(String id, String name, int age) {

        Employee {
            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException("Employee ID cannot be blank");
            }

            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Employee name cannot be blank");
            }

            if (age < 18) {
                throw new IllegalArgumentException("Employee must be at least 18 years old");
            }

            // Reassigning a parameter changes the value stored in the component.
            name = name.trim();
        }
    }
}