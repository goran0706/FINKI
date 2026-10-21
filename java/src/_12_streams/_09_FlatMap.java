package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _09_FlatMap {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of(
                new Employee(1, "Alice", 6500, null)
        ));

        Department hr = new Department(2, "HR", List.of(
                new Employee(2, "Bob", 4500, null),
                new Employee(3, "Charlie", 5500, null)
        ));

        // flatMap() transforms each element into a stream, then flattens
        // all resulting streams into one stream.
        List<Department> departments = List.of(engineering, hr);

        List<Employee> allEmployees = departments.stream()
                .flatMap(department -> department.employees().stream())
                .toList();

        System.out.println("All employees:");
        allEmployees.forEach(System.out::println);

        // Filter employees across all departments.
        List<Employee> highEarners = departments.stream()
                .flatMap(department -> department.employees().stream())
                .filter(employee -> employee.salary() >= 5000)
                .toList();

        System.out.println("\nEmployees earning at least 5000:");
        highEarners.forEach(System.out::println);

        // map() would produce a Stream<List<Employee>>.
        // flatMap() produces a Stream<Employee> by flattening the lists.
        List<List<String>> namesByDepartment = List.of(
                List.of("Alice", "Alex"),
                List.of("Bob", "Charlie")
        );

        List<String> allNames = namesByDepartment.stream()
                .flatMap(List::stream)
                .toList();

        System.out.println("\nAll names: " + allNames);
    }
}