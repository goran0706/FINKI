package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.Comparator;
import java.util.List;

public class _08_LimitAndSkip {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr),
                new Employee(5, "Alex", 8000, engineering),
                new Employee(6, "Eve", 5000, hr)
        );

        // limit() keeps at most the specified number of elements.
        List<Employee> firstThree = employees.stream()
                .limit(3)
                .toList();

        System.out.println("First three employees:");
        firstThree.forEach(System.out::println);

        // skip() discards the specified number of elements.
        List<Employee> afterFirstThree = employees.stream()
                .skip(3)
                .toList();

        System.out.println("\nEmployees after the first three:");
        afterFirstThree.forEach(System.out::println);

        // Combine sorted() and limit() to find the three highest-paid employees.
        List<Employee> topThreeEarners = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::salary).reversed())
                .limit(3)
                .toList();

        System.out.println("\nThree highest-paid employees:");
        topThreeEarners.forEach(System.out::println);

        // Combine sorted(), skip(), and limit() to implement pagination.
        int pageNumber = 2; // Pages are numbered starting at 1.
        int pageSize = 2;

        List<Employee> page = employees.stream()
                .sorted(Comparator.comparingInt(Employee::id))
                .skip((long) (pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toList();

        System.out.println("\nPage " + pageNumber + ":");
        page.forEach(System.out::println);

        // skip() and limit() do not modify the original collection.
    }
}