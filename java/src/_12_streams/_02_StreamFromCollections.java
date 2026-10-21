package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _02_StreamFromCollections {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // Create a stream from a collection and process its elements.
        employees.stream()
                .forEach(System.out::println);

        // Streams do not modify the original collection.
        List<String> employeeNames = employees.stream()
                .map(Employee::name)
                .toList();

        System.out.println("Employee names: " + employeeNames);

        // Filter employees and collect the matching elements into a new list.
        List<Employee> highEarners = employees.stream()
                .filter(employee -> employee.salary() >= 6000)
                .toList();

        System.out.println("Employees earning at least 6000:");
        highEarners.forEach(System.out::println);

        System.out.println("Original employee count: " + employees.size());
        System.out.println("High earner count: " + highEarners.size());
    }
}