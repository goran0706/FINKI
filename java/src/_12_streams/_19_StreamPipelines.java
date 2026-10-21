package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class _19_StreamPipelines {

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

        // A stream pipeline consists of a source, intermediate operations,
        // and a terminal operation.
        List<String> highEarnerNames = employees.stream() // Source
                .filter(employee -> employee.salary() >= 6000) // Intermediate
                .sorted(Comparator.comparing(Employee::name)) // Intermediate
                .map(Employee::name) // Intermediate
                .toList(); // Terminal

        System.out.println("High earners: " + highEarnerNames);

        // Intermediate operations are lazy. They execute only when
        // a terminal operation consumes the pipeline.
        long count = employees.stream()
                .filter(employee -> {
                    System.out.println("Filtering: " + employee.name());
                    return employee.salary() >= 6000;
                })
                .count();

        System.out.println("High earner count: " + count);

        // A pipeline can transform objects and aggregate results.
        Map<String, Double> salaryByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name(),
                        Collectors.summingDouble(Employee::salary)
                ));

        System.out.println("Salary by department: " + salaryByDepartment);

        // Each stream can be consumed only once.
        // Create a new stream from the source for a separate pipeline.
        long employeeCount = employees.stream().count();
        boolean hasLowEarner = employees.stream()
                .anyMatch(employee -> employee.salary() < 5000);

        System.out.println("Employee count: " + employeeCount);
        System.out.println("Has employee earning below 5000: " + hasLowEarner);
    }
}