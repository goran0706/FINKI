package _10_optionals;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/*
 * OPTIONAL WITH COLLECTIONS
 *
 * Optional and collections solve different problems:
 *
 * - Optional<T> represents zero or one value.
 * - List<T> represents zero or more values.
 *
 * A List can be empty, so a method returning List<Employee> usually
 * does not need to return Optional<List<Employee>>.
 *
 * Use Optional when the result itself may be absent, such as looking
 * up one Employee by ID.
 *
 * Use a collection when returning multiple results, such as all
 * Employees in a Department.
 *
 * This example demonstrates how Optional can be used when retrieving
 * individual objects and how it differs from collection-based results.
 */
public class _18_OptionalWithCollections {

    private static final List<Employee> EMPLOYEES = List.of(
            new Employee("EMP-001", "Alex", "Engineering"),
            new Employee("EMP-002", "Sam", "Finance"),
            new Employee("EMP-003", "Jordan", "Engineering")
    );

    /*
     * Returns zero or one Employee.
     *
     * Optional makes it explicit that the requested Employee might
     * not exist.
     */
    public static Optional<Employee> findEmployeeById(String id) {
        return EMPLOYEES.stream()
                .filter(employee -> employee.id().equals(id))
                .findFirst();
    }

    /*
     * Returns zero or more Employees.
     *
     * An empty List represents no matching Employees.
     * Optional<List<Employee>> is unnecessary here.
     */
    public static List<Employee> findEmployeesByDepartment(String department) {
        return EMPLOYEES.stream()
                .filter(employee -> employee.department().equals(department))
                .toList();
    }

    static void main(String[] args) {

        /*
         * Example 1: Find one Employee.
         *
         * The Employee may or may not exist, so Optional<Employee>
         * is appropriate.
         */
        Optional<Employee> employee = findEmployeeById("EMP-001");

        employee.ifPresent(System.out::println);

        /*
         * Example 2: Handle an Employee that does not exist.
         *
         * The Optional is empty, so orElse() supplies the fallback.
         */
        Optional<Employee> missingEmployee = findEmployeeById("EMP-999");

        System.out.println(
                "Lookup result: "
                        + missingEmployee.map(Employee::name)
                        .orElse("Employee not found")
        );

        /*
         * Example 3: Retrieve multiple Employees.
         *
         * The result is a List<Employee>, not Optional<List<Employee>>.
         * The List can contain any number of matching Employees,
         * including zero.
         */
        List<Employee> engineeringEmployees =
                findEmployeesByDepartment("Engineering");

        System.out.println("Engineering employees:");

        engineeringEmployees.forEach(System.out::println);

        /*
         * Example 4: A department with no Employees.
         *
         * The method returns an empty List rather than null.
         */
        List<Employee> legalEmployees =
                findEmployeesByDepartment("Legal");

        System.out.println(
                "Legal employees found: " + legalEmployees.size()
        );

        /*
         * Example 5: Why Optional<List<Employee>> is usually unnecessary.
         *
         * A List already represents the possibility of zero results.
         * Wrapping it in Optional introduces two separate empty states:
         *
         * 1. Optional.empty(): no List was provided.
         * 2. Optional.of(emptyList()): a List was provided, but it has
         *    no elements.
         *
         * Unless these states have distinct meanings in the domain,
         * returning List<Employee> is simpler and clearer.
         */
        List<Employee> employees = new ArrayList<>();

        System.out.println("Initially empty: " + employees.isEmpty());

        employees.add(new Employee("EMP-004", "Taylor", "Legal"));

        System.out.println("After adding an Employee: " + employees);
    }

    record Employee(String id, String name, String department) {

        @Override
        public String toString() {
            return id + ": " + name + " (" + department + ")";
        }
    }
}