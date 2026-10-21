package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class _15_CollectorsPartitioning {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr),
                new Employee(5, "Eve", 3500, hr),
                new Employee(6, "Frank", 8000, engineering)
        );

        // partitioningBy() divides elements into exactly two groups:
        // true for elements matching the predicate and false for the rest.
        Map<Boolean, List<Employee>> salaryPartitions = employees.stream()
                .collect(Collectors.partitioningBy(
                        employee -> employee.salary() >= 6000
                ));

        System.out.println("Employees earning at least 6000:");
        salaryPartitions.get(true).forEach(System.out::println);

        System.out.println("\nEmployees earning less than 6000:");
        salaryPartitions.get(false).forEach(System.out::println);

        // Partition employees and count the number in each group.
        Map<Boolean, Long> employeeCounts = employees.stream()
                .collect(Collectors.partitioningBy(
                        employee -> employee.salary() >= 6000,
                        Collectors.counting()
                ));

        System.out.println("\nEmployee counts by salary threshold:");
        System.out.println(employeeCounts);

        // Partition employees and calculate total salary in each group.
        Map<Boolean, Double> salaryTotals = employees.stream()
                .collect(Collectors.partitioningBy(
                        employee -> employee.salary() >= 6000,
                        Collectors.summingDouble(Employee::salary)
                ));

        System.out.println("\nTotal salary by salary threshold:");
        System.out.println(salaryTotals);

        // Unlike groupingBy(), partitioningBy() always provides both
        // Boolean keys, even when one group contains no elements.
    }
}