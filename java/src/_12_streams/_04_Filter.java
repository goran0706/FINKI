package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _04_Filter {

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

        // filter() keeps only elements that satisfy the predicate.
        List<Employee> highEarners = employees.stream()
                .filter(employee -> employee.salary() >= 6000)
                .toList();

        System.out.println("Employees earning at least 6000:");
        highEarners.forEach(System.out::println);

        // Filter using multiple conditions.
        List<Employee> engineeringHighEarners = employees.stream()
                .filter(employee -> employee.department().name().equals("Engineering"))
                .filter(employee -> employee.salary() >= 6000)
                .toList();

        System.out.println("\nEngineering employees earning at least 6000:");
        engineeringHighEarners.forEach(System.out::println);

        // Filter by a property of the employee.
        List<Employee> namesStartingWithA = employees.stream()
                .filter(employee -> employee.name().startsWith("A"))
                .toList();

        System.out.println("\nEmployees whose names start with A:");
        namesStartingWithA.forEach(System.out::println);
    }
}