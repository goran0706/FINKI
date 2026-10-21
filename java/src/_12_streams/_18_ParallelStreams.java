package _12_streams;

import _12_streams.models.Department;
import _12_streams.models.Employee;

import java.util.List;
import java.util.concurrent.ForkJoinPool;

public class _18_ParallelStreams {

    static void main(String[] args) {

        Department engineering = new Department(1, "Engineering", List.of());
        Department hr = new Department(2, "HR", List.of());

        List<Employee> employees = List.of(
                new Employee(1, "Alice", 6500, engineering),
                new Employee(2, "Bob", 4500, engineering),
                new Employee(3, "Charlie", 5500, hr),
                new Employee(4, "Diana", 7000, hr)
        );

        // parallelStream() allows elements to be processed concurrently.
        // It commonly uses the shared ForkJoinPool.
        double totalSalary = employees.parallelStream()
                .mapToDouble(Employee::salary)
                .sum();

        System.out.println("Total salary: " + totalSalary);

        // A parallel pipeline can filter and transform domain objects.
        List<String> highEarnerNames = employees.parallelStream()
                .filter(employee -> employee.salary() >= 6000)
                .map(Employee::name)
                .toList();

        System.out.println("High earners: " + highEarnerNames);

        // forEach() does not guarantee encounter order in a parallel stream.
        System.out.println("\nParallel forEach:");
        employees.parallelStream()
                .forEach(System.out::println);

        // forEachOrdered() preserves encounter order when the source
        // has a defined encounter order, but may reduce parallelism.
        System.out.println("\nParallel forEachOrdered:");
        employees.parallelStream()
                .forEachOrdered(System.out::println);

        // Avoid mutating shared collections from parallel stream operations.
        // Prefer reduction and collectors for accumulating results.
        double safeTotal = employees.parallelStream()
                .mapToDouble(Employee::salary)
                .sum();

        System.out.println("\nSafe total: " + safeTotal);

        // Parallel processing has overhead and is not automatically faster.
        // Benchmark representative workloads before choosing it.
        System.out.println("Common pool parallelism: "
                + ForkJoinPool.getCommonPoolParallelism());
    }
}