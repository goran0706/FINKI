package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _07_Distinct {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // distinct() removes duplicate values according to equals().
        // Employee currently uses Object's default equals(), so separate
        // Employee instances are considered different, even if their fields match.
        List<String> departmentNames = employees.stream()
                .map(employee -> employee.department().name())
                .distinct()
                .toList();

        System.out.println("Distinct departments: " + departmentNames);

        // Repeated values are removed from a stream of strings.
        List<String> names = List.of(
                "Alice", "Bob", "Alice", "Charlie", "Bob"
        );

        List<String> uniqueNames = names.stream()
                .distinct()
                .toList();

        System.out.println("Distinct names: " + uniqueNames);

        // To remove duplicate Employee objects by a business key such as ID,
        // use a key-based approach rather than relying on distinct().
        List<Integer> employeeIds = employees.stream()
                .map(Employee::id)
                .distinct()
                .toList();

        System.out.println("Distinct employee IDs: " + employeeIds);
    }
}