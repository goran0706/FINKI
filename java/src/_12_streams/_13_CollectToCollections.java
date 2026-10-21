package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class _13_CollectToCollections {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // toList() collects stream elements into an unmodifiable List.
        List<String> employeeNames = employees.stream()
                .map(Employee::name)
                .toList();

        System.out.println("Employee names: " + employeeNames);

        // Collect into a mutable ArrayList using Collectors.toCollection().
        List<String> mutableNames = employees.stream()
                .map(Employee::name)
                .collect(Collectors.toCollection(java.util.ArrayList::new));

        mutableNames.add("Eve");
        System.out.println("Mutable names: " + mutableNames);

        // Collect distinct department names into a Set.
        Set<String> departmentNames = employees.stream()
                .map(employee -> employee.department().name())
                .collect(Collectors.toSet());

        System.out.println("Departments: " + departmentNames);

        // Collect employees into a Map keyed by employee ID.
        // The key must be unique; duplicate keys cause an exception.
        Map<Integer, Employee> employeesById = employees.stream()
                .collect(Collectors.toMap(
                        Employee::id,
                        employee -> employee
                ));

        System.out.println("Employee with ID 2: " + employeesById.get(2));

        // Collect employee names into a single comma-separated String.
        String names = employees.stream()
                .map(Employee::name)
                .collect(Collectors.joining(", "));

        System.out.println("Names: " + names);
    }
}