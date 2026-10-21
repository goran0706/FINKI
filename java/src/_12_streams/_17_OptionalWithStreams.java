package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.Optional;

public class _17_OptionalWithStreams {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // findFirst() returns an Optional because a stream may have no match.
        Optional<Employee> employee = employees.stream()
                .filter(candidate -> candidate.name().equals("Alice"))
                .findFirst();

        employee.ifPresent(System.out::println);

        // map() transforms the value inside an Optional if it is present.
        Optional<String> employeeName = employees.stream()
                .filter(candidate -> candidate.id() == 2)
                .findFirst()
                .map(Employee::name);

        System.out.println("Employee name: " + employeeName.orElse("Not found"));

        // flatMap() is useful when the mapping function itself returns an Optional.
        // This example safely extracts a department name from a found employee.
        Optional<String> departmentName = employees.stream()
                .filter(candidate -> candidate.id() == 3)
                .findFirst()
                .map(Employee::department)
                .map(Department::name);

        System.out.println("Department: " + departmentName.orElse("Not found"));

        // filter() can further restrict the value held by an Optional.
        Optional<Employee> highEarner = employees.stream()
                .filter(candidate -> candidate.name().equals("Bob"))
                .findFirst()
                .filter(candidate -> candidate.salary() >= 6000);

        System.out.println("High earner found: " + highEarner.isPresent());

        // orElseThrow() returns the value or throws an exception if absent.
        Employee selectedEmployee = employees.stream()
                .filter(candidate -> candidate.id() == 4)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Employee not found"));

        System.out.println("Selected employee: " + selectedEmployee);

        // If no element matches, findFirst() returns Optional.empty().
        Optional<Employee> missingEmployee = employees.stream()
                .filter(candidate -> candidate.id() == 99)
                .findFirst();

        System.out.println("Missing employee: " + missingEmployee);
    }
}