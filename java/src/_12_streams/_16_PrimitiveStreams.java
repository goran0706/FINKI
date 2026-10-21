package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _16_PrimitiveStreams {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // mapToInt() converts an object stream into an IntStream.
        // Primitive streams avoid boxing numeric values into wrapper objects.
        int totalNameLength = employees.stream()
                .mapToInt(employee -> employee.name().length())
                .sum();

        System.out.println("Total name length: " + totalNameLength);

        // mapToDouble() converts an object stream into a DoubleStream.
        // Use it for numeric calculations such as salary totals and averages.
        double totalSalary = employees.stream()
                .mapToDouble(Employee::salary)
                .sum();

        double averageSalary = employees.stream()
                .mapToDouble(Employee::salary)
                .average()
                .orElse(0.0);

        System.out.println("Total salary: " + totalSalary);
        System.out.println("Average salary: " + averageSalary);

        // IntStream.range() includes the start and excludes the end.
        System.out.println("\nNumbers from 1 to 5:");
        java.util.stream.IntStream.range(1, 6)
                .forEach(System.out::println);

        // IntStream.rangeClosed() includes both endpoints.
        System.out.println("\nNumbers from 1 to 5, inclusive:");
        java.util.stream.IntStream.rangeClosed(1, 5)
                .forEach(System.out::println);

        // mapToLong() converts an object stream into a LongStream.
        long totalEmployeeIds = employees.stream()
                .mapToLong(Employee::id)
                .sum();

        System.out.println("Sum of employee IDs: " + totalEmployeeIds);

        // Primitive streams provide numeric operations such as sum(),
        // average(), min(), and max() without an additional collector.
    }
}