package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.OptionalDouble;

public class _10_Reduction {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // reduce() combines stream elements into a single result.
        // Here, it adds all salaries together.
        double totalSalary = employees.stream()
                .map(Employee::salary)
                .reduce(0.0, Double::sum);

        System.out.println("Total salary: " + totalSalary);

        // The identity value is the starting value for the reduction.
        // For addition, the identity is 0.
        double totalUsingLambda = employees.stream()
                .map(Employee::salary)
                .reduce(0.0, (total, salary) -> total + salary);

        System.out.println("Total using lambda: " + totalUsingLambda);

        // Use reduce() to find the highest salary.
        OptionalDouble highestSalary = employees.stream()
                .mapToDouble(Employee::salary)
                .max();

        System.out.println("Highest salary: " + highestSalary.orElse(0.0));

        // Use reduce() to combine employee names into one string.
        String employeeNames = employees.stream()
                .map(Employee::name)
                .reduce((first, second) -> first + ", " + second)
                .orElse("No employees");

        System.out.println("Employees: " + employeeNames);

        // For numeric totals, sum() is usually clearer than reduce().
        double salarySum = employees.stream()
                .mapToDouble(Employee::salary)
                .sum();

        System.out.println("Salary sum: " + salarySum);
    }
}