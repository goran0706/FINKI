package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.Arrays;

public class _03_StreamFromArrays {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", java.util.List.of());
        Department hr = new Department(2, "HR", java.util.List.of());

        Employee[] employees = {
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        };

        // Arrays.stream() creates a stream from an array.
        Arrays.stream(employees)
                .forEach(System.out::println);

        // Filter an array's elements using a stream.
        Employee[] highEarners = Arrays.stream(employees)
                .filter(employee -> employee.salary() >= 6000)
                .toArray(Employee[]::new);

        System.out.println("\nEmployees earning at least 6000:");
        Arrays.stream(highEarners)
                .forEach(System.out::println);

        // Convert employee objects into names.
        String[] employeeNames = Arrays.stream(employees)
                .map(Employee::name)
                .toArray(String[]::new);

        System.out.println("\nEmployee names: " + Arrays.toString(employeeNames));

        // toArray(Employee[]::new) creates an array of the correct type.
        System.out.println("High earner count: " + highEarners.length);
    }
}