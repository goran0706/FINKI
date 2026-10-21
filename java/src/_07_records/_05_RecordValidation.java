package _07_records;

public class _05_RecordValidation {

    static void main(String[] args) {

        Employee validEmployee = new Employee(" E001 ", " Alice ", 30);

        System.out.println(validEmployee.id());   // E001
        System.out.println(validEmployee.name()); // Alice

        try {
            new Employee("E002", "Bob", 16);
        } catch (IllegalArgumentException exception) {
            System.out.println(exception.getMessage());
        }

        try {
            new Employee("E003", "   ", 25);
        } catch (IllegalArgumentException exception) {
            System.out.println(exception.getMessage());
        }
    }

    // Records can enforce data integrity through their constructors.
    // This ensures every successfully created instance satisfies the rules.
    record Employee(String id, String name, int age) {

        Employee {
            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException("Employee ID is required");
            }

            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Employee name is required");
            }

            if (age < 18 || age > 100) {
                throw new IllegalArgumentException("Employee age must be between 18 and 100");
            }

            id = id.trim();
            name = name.trim();
        }
    }
}