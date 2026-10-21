package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class _20_StreamBestPractices {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr),
                new Employee(5, "Alex", 8000, engineering)
        );

        // 1. Prefer readable pipelines over unnecessarily complex chains.
        List<Employee> highEarners = employees.stream()
                .filter(employee -> employee.salary() >= 6000)
                .toList();

        System.out.println("High earners: " + highEarners);

        // 2. Use method references when they improve readability.
        List<String> employeeNames = employees.stream()
                .map(Employee::name)
                .toList();

        System.out.println("Employee names: " + employeeNames);

        // 3. Use primitive streams for numeric calculations.
        double averageSalary = employees.stream()
                .mapToDouble(Employee::salary)
                .average()
                .orElse(0.0);

        System.out.println("Average salary: " + averageSalary);

        // 4. Use short-circuiting operations when you only need a match.
        boolean hasHighEarner = employees.stream()
                .anyMatch(employee -> employee.salary() >= 8000);

        System.out.println("Has employee earning at least 8000: " + hasHighEarner);

        // 5. Use collectors instead of modifying external mutable state.
        Map<String, List<Employee>> employeesByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name()
                ));

        System.out.println("Employees by department: " + employeesByDepartment);

        // 6. Use an explicit comparator when sorting domain objects.
        List<Employee> highestPaidFirst = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::salary).reversed())
                .toList();

        System.out.println("Highest paid first: " + highestPaidFirst);

        // 7. Remember that distinct() uses equals() and hashCode().
        // Employee does not override them, so distinct() does not identify
        // separate Employee instances as duplicates based on their fields.
        List<String> uniqueDepartmentNames = employees.stream()
                .map(employee -> employee.department().name())
                .distinct()
                .toList();

        System.out.println("Unique departments: " + uniqueDepartmentNames);

        // 8. Filter nulls explicitly when the source can contain them.
        List<String> namesWithPossibleNulls = java.util.Arrays.asList(
                "Alice", null, "Bob", null, "Charlie"
        );

        List<String> nonNullNames = namesWithPossibleNulls.stream()
                .filter(Objects::nonNull)
                .toList();

        System.out.println("Non-null names: " + nonNullNames);

        // 9. Do not reuse a stream after a terminal operation.
        long count = employees.stream().count();
        System.out.println("Employee count: " + count);

        // Create a new stream for a separate operation.
        double totalSalary = employees.stream()
                .mapToDouble(Employee::salary)
                .sum();

        System.out.println("Total salary: " + totalSalary);

        // 10. Do not assume parallel streams are faster.
        // Benchmark realistic workloads before using parallelStream().
        // Avoid shared mutable state in parallel operations.
    }
}