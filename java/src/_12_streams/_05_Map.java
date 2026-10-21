package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;

public class _05_Map {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // map() transforms each element into another value.
        List<String> employeeNames = employees.stream()
                .map(Employee::name)
                .toList();

        System.out.println("Employee names: " + employeeNames);

        // Transform each Employee into a formatted String.
        List<String> employeeDetails = employees.stream()
                .map(employee -> employee.name() + " earns " + employee.salary())
                .toList();

        System.out.println("\nEmployee details:");
        employeeDetails.forEach(System.out::println);

        // Transform each Employee into their Department name.
        List<String> departmentNames = employees.stream()
                .map(employee -> employee.department().name())
                .toList();

        System.out.println("\nDepartment names: " + departmentNames);

        // map() does not automatically remove duplicate results.
        // Multiple employees can belong to the same department.
        System.out.println("Department entry count: " + departmentNames.size());
    }
}