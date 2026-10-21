package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class _14_CollectorsGrouping {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());
        Department finance = new Department(3, "Finance", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr),
                new Employee(5, "Eve", 6000, finance),
                new Employee(6, "Frank", 4000, finance)
        );

        // groupingBy() groups elements using the value returned by a classifier.
        Map<String, List<Employee>> employeesByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name()
                ));

        System.out.println("Employees by department:");
        employeesByDepartment.forEach((department, departmentEmployees) -> {
            System.out.println(department + ": " + departmentEmployees);
        });

        // Group employees by department and count employees in each group.
        Map<String, Long> employeeCountsByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name(),
                        Collectors.counting()
                ));

        System.out.println("\nEmployee counts by department:");
        System.out.println(employeeCountsByDepartment);

        // Group employees by department and calculate total salary per group.
        Map<String, Double> salaryTotalsByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name(),
                        Collectors.summingDouble(Employee::salary)
                ));

        System.out.println("\nTotal salary by department:");
        System.out.println(salaryTotalsByDepartment);

        // Group employees by department and collect only their names.
        Map<String, List<String>> namesByDepartment = employees.stream()
                .collect(Collectors.groupingBy(
                        employee -> employee.department().name(),
                        Collectors.mapping(Employee::name, Collectors.toList())
                ));

        System.out.println("\nEmployee names by department:");
        System.out.println(namesByDepartment);
    }
}