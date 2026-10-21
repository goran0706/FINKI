package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _11_CountAndMatch {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // count() returns the number of elements in a stream.
        long employeeCount = employees.stream().count();

        System.out.println("Employee count: " + employeeCount);

        // anyMatch() returns true if at least one element matches the predicate.
        boolean hasHighEarner = employees.stream()
                .anyMatch(employee -> employee.salary() >= 6500);

        System.out.println("Has employee earning at least 6500: " + hasHighEarner);

        // allMatch() returns true if every element matches the predicate.
        boolean allEarnAboveMinimum = employees.stream()
                .allMatch(employee -> employee.salary() >= 4000);

        System.out.println("All employees earn at least 4000: " + allEarnAboveMinimum);

        // noneMatch() returns true if no elements match the predicate.
        boolean nobodyEarnsBelowMinimum = employees.stream()
                .noneMatch(employee -> employee.salary() < 3000);

        System.out.println("Nobody earns below 3000: " + nobodyEarnsBelowMinimum);

        // Match operations short-circuit when the result is determined.
        // They do not necessarily process every element.

        // An empty stream returns false for anyMatch() and true for
        // allMatch() and noneMatch().
        List<Employee> noEmployees = List.of();

        System.out.println("Empty anyMatch: " +
                noEmployees.stream().anyMatch(employee -> employee.salary() > 0));

        System.out.println("Empty allMatch: " +
                noEmployees.stream().allMatch(employee -> employee.salary() > 0));

        System.out.println("Empty noneMatch: " +
                noEmployees.stream().noneMatch(employee -> employee.salary() > 0));
    }
}