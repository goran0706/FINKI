package _07_records;

import java.util.List;

public class _20_RecordBestPractices {

    static void main(String[] args) {

        EmployeeResponse employee = new EmployeeResponse(
                "E001",
                "Alice",
                "Engineering"
        );

        System.out.println(employee);

        EmployeeId employeeId = new EmployeeId(" E001 ");
        System.out.println(employeeId.value()); // E001

        Department department = new Department(
                "Engineering",
                List.of("Alice", "Bob")
        );

        System.out.println(department.employees());

        Salary salary = new Salary(5000);
        System.out.println(salary.annualAmount()); // 60000.0

        Address address = new Address(
                "Main Street 10",
                "Skopje",
                "North Macedonia"
        );

        System.out.println(address.city());

        // Avoid records when the object requires mutable state, inheritance
        // from another class, or additional per-instance fields.
        // Use a regular class when those requirements apply.
    }

    // 1. Use records primarily for data carriers with value-based equality.
    record EmployeeResponse(String id, String name, String department) {
    }

    // 2. Validate required components in the canonical constructor.
    record EmployeeId(String value) {

        EmployeeId {
            if (value == null || value.isBlank()) {
                throw new IllegalArgumentException("Employee ID is required");
            }

            value = value.trim();
        }
    }

    // 3. Make defensive copies of mutable collections.
    record Department(String name, List<String> employees) {

        Department {
            employees = List.copyOf(employees);
        }
    }

    // 4. Add methods for behavior derived from record components.
    record Salary(double monthlyAmount) {

        public double annualAmount() {
            return monthlyAmount * 12;
        }
    }

    // 5. Prefer meaningful component names and types.
    record Address(String street, String city, String country) {
    }
}