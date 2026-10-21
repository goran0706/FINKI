package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.Comparator;
import java.util.List;

public class _06_Sorted {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Charlie", 5500, engineering),
                new Employee(2, "Alice", 6500, engineering),
                new Employee(3, "Diana", 7000, hr),
                new Employee(4, "Bob", 4500, hr)
        );

        // Sort employees by name in ascending alphabetical order.
        List<Employee> byName = employees.stream()
                .sorted(Comparator.comparing(Employee::name))
                .toList();

        System.out.println("Sorted by name:");
        byName.forEach(System.out::println);

        // Sort employees by salary in ascending order.
        List<Employee> bySalary = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::salary))
                .toList();

        System.out.println("\nSorted by salary (ascending):");
        bySalary.forEach(System.out::println);

        // Reverse the comparator to sort salary in descending order.
        List<Employee> highestPaidFirst = employees.stream()
                .sorted(Comparator.comparingDouble(Employee::salary).reversed())
                .toList();

        System.out.println("\nSorted by salary (descending):");
        highestPaidFirst.forEach(System.out::println);

        // Chain comparators to sort by department name first,
        // then by salary in descending order within each department.
        List<Employee> byDepartmentThenSalary = employees.stream()
                .sorted(
                        Comparator.comparing(
                                        (Employee employee) -> employee.department().name()
                                )
                                .thenComparing(
                                        Comparator.comparingDouble(Employee::salary).reversed()
                                )
                )
                .toList();

        System.out.println("\nSorted by department, then salary descending:");
        byDepartmentThenSalary.forEach(System.out::println);

        // sorted() creates an ordered stream; toList() collects the result.
        // The original employees list remains unchanged.
    }
}