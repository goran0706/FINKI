package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.Optional;

public class _12_FindOperations {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // findFirst() returns the first matching element in encounter order.
        // Optional is used because the stream might contain no matching element.
        Optional<Employee> firstHighEarner = employees.stream()
                .filter(employee -> employee.salary() >= 6000)
                .findFirst();

        firstHighEarner.ifPresent(System.out::println);

        // orElse() supplies a fallback when the Optional is empty.
        Employee selectedEmployee = employees.stream()
                .filter(employee -> employee.name().equals("Unknown"))
                .findFirst()
                .orElse(null);

        System.out.println("Selected employee: " + selectedEmployee);

        // findAny() returns some element from the stream.
        // It is useful when any matching element is acceptable.
        Optional<Employee> anyHighEarner = employees.stream()
                .filter(employee -> employee.salary() >= 6000)
                .findAny();

        anyHighEarner.ifPresent(employee ->
                System.out.println("Any high earner: " + employee));

        // With parallel streams, findAny() may return any matching element.
        // findFirst() preserves encounter-order semantics when the source
        // has a defined encounter order.
        Optional<Employee> parallelResult = employees.parallelStream()
                .filter(employee -> employee.salary() >= 6000)
                .findAny();

        parallelResult.ifPresent(employee ->
                System.out.println("Parallel result: " + employee));

        // Both findFirst() and findAny() throw NullPointerException if
        // the selected stream element is null.
    }
}