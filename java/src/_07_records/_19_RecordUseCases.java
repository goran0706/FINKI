package _07_records;

import java.util.List;

public class _19_RecordUseCases {

    static SalarySummary calculateSalary(double monthlySalary) {
        return new SalarySummary(monthlySalary, monthlySalary * 12);
    }

    static EmployeeResponse getEmployee() {
        return new EmployeeResponse("E001", "Alice", "Engineering");
    }

    static void main(String[] args) {

        // Example 1: Transfer employee data.
        EmployeeResponse employee = getEmployee();

        System.out.println(employee.name());
        System.out.println(employee.department());

        // Example 2: Represent an address as a value.
        Address address = new Address(
                "Main Street 10",
                "Tetovo",
                "North Macedonia"
        );

        System.out.println(address.city());

        // Example 3: Return multiple related calculation results.
        SalarySummary salary = calculateSalary(5000);

        System.out.println(salary.monthlySalary());
        System.out.println(salary.annualSalary());

        // Example 4: Represent a generic search result.
        SearchResult<String> result = new SearchResult<>(
                List.of("Alice", "Bob", "Charlie"),
                3
        );

        System.out.println(result.items());
        System.out.println(result.totalCount());
    }

    // Use records for simple data-transfer objects.
    record EmployeeResponse(String id, String name, String department) {
    }

    // Use records to represent structured values.
    record Address(String street, String city, String country) {
    }

    // Use records to return multiple related values from a method.
    record SalarySummary(double monthlySalary, double annualSalary) {
    }

    // Use records for immutable result objects.
    record SearchResult<T>(List<T> items, int totalCount) {

        SearchResult {
            items = List.copyOf(items);
        }
    }
}