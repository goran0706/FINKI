package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL.OFNULLABLE()
 *
 * Optional.ofNullable(value) creates an Optional that:
 *
 * 1. Contains the supplied value if it is non-null.
 * 2. Is empty if the supplied value is null.
 *
 * This is useful when working with existing methods or data sources
 * that may return null.
 *
 * Unlike Optional.of(value), Optional.ofNullable(value) does not throw
 * NullPointerException when the supplied value is null.
 */
public class _03_OptionalOfNullable {

    /*
     * This method represents a legacy method that returns either
     * an Employee or null.
     */
    public static Employee findEmployeeOrNull(String id) {

        if ("EMP-001".equals(id)) {
            return new Employee("EMP-001", "Alex");
        }

        return null;
    }

    static void main(String[] args) {

        /*
         * Case 1: The legacy method returns an Employee.
         *
         * ofNullable() wraps the non-null value in an Optional.
         */
        Employee employee = findEmployeeOrNull("EMP-001");

        Optional<Employee> employeeOptional =
                Optional.ofNullable(employee);

        employeeOptional.ifPresent(value ->
                System.out.println(value.name())
        );

        /*
         * Case 2: The legacy method returns null.
         *
         * ofNullable() creates an empty Optional instead of throwing
         * NullPointerException.
         */
        Employee missingEmployee = findEmployeeOrNull("EMP-999");

        Optional<Employee> missingOptional =
                Optional.ofNullable(missingEmployee);

        System.out.println("Employee found: "
                + missingOptional.isPresent());

        /*
         * ofNullable() can also be called directly with a potentially
         * null expression.
         */
        Optional<String> name = Optional.ofNullable(null);

        System.out.println("Name present: " + name.isPresent());

        /*
         * Prefer returning Optional<T> directly from methods that you
         * control when the result may legitimately be absent.
         *
         * ofNullable() is particularly useful when adapting APIs that
         * return nullable values.
         */
    }

    record Employee(String id, String name) {

    }
}