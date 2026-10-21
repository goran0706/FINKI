package _10_optionals;

import java.util.Optional;

/*
 * OR()
 *
 * Optional.or() provides an alternative Optional when the original
 * Optional is empty.
 *
 * Introduced in Java 9.
 *
 * Syntax:
 *     optional.or(() -> alternativeOptional)
 *
 * Unlike orElse() and orElseGet(), or() returns an Optional rather
 * than the contained value.
 *
 * Behavior:
 * 1. If the original Optional is present, it is returned unchanged.
 * 2. If the original Optional is empty, the Supplier is executed
 *    to obtain an alternative Optional.
 *
 * The Supplier must return a non-null Optional.
 * Returning null causes NullPointerException.
 *
 * This is useful when trying multiple lookup methods or data sources
 * that each return Optional<T>.
 */
public class _15_Or {

    /*
     * Simulates looking up an employee in the primary data source.
     */
    public static Optional<Employee> findEmployeeById(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee("EMP-001", "Alex", "Engineering")
            );
        }

        return Optional.empty();
    }

    /*
     * Simulates looking up an employee in an alternative data source.
     */
    public static Optional<Employee> findEmployeeInBackup(String id) {

        if ("EMP-002".equals(id)) {
            return Optional.of(
                    new Employee("EMP-002", "Sam", "Finance")
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        /*
         * Example 1: The primary lookup succeeds.
         *
         * The original Optional is returned.
         * The fallback Supplier is not executed.
         */
        Optional<Employee> employee = findEmployeeById("EMP-001")
                .or(() -> findEmployeeInBackup("EMP-001"));

        System.out.println("Primary lookup: " + employee);

        /*
         * Example 2: The primary lookup fails.
         *
         * The fallback Supplier executes and performs the backup lookup.
         * If the backup lookup succeeds, its Optional is returned.
         */
        Optional<Employee> backupEmployee = findEmployeeById("EMP-002")
                .or(() -> findEmployeeInBackup("EMP-002"));

        System.out.println("Backup lookup: " + backupEmployee);

        /*
         * Example 3: Both lookups fail.
         *
         * The result remains Optional.empty().
         */
        Optional<Employee> missingEmployee = findEmployeeById("EMP-999")
                .or(() -> findEmployeeInBackup("EMP-999"));

        System.out.println("Missing employee: " + missingEmployee);

        /*
         * Example 4: Chain multiple alternative lookups.
         *
         * Each subsequent Supplier executes only if every preceding
         * Optional is empty.
         *
         * The first successful lookup determines the result.
         */
        Optional<Employee> employeeWithMultipleFallbacks =
                findEmployeeById("EMP-003")
                        .or(() -> findEmployeeInBackup("EMP-003"))
                        .or(() -> findEmployeeById("EMP-001"));

        System.out.println(
                "Multiple fallbacks: " + employeeWithMultipleFallbacks
        );

        /*
         * Example 5: or() versus orElseGet().
         *
         * or() returns Optional<Employee>.
         * orElseGet() returns Employee.
         *
         * Use or() when the fallback operation itself returns an Optional
         * and you want to preserve the Optional-based lookup chain.
         */
        Optional<Employee> optionalResult = findEmployeeById("EMP-002")
                .or(() -> findEmployeeInBackup("EMP-002"));

        Employee employeeResult = findEmployeeById("EMP-002")
                .orElseGet(
                        () -> findEmployeeInBackup("EMP-002").orElse(null)
                );

        System.out.println("Optional result: " + optionalResult);
        System.out.println("Employee result: " + employeeResult);
    }

    record Employee(String id, String name, String department) {

        @Override
        public String toString() {
            return name + " (" + department + ")";
        }
    }
}