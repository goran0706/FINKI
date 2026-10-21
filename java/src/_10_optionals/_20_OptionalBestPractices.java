package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL BEST PRACTICES
 *
 * Optional is designed primarily to represent a return value that
 * may or may not be present.
 *
 * Best practices:
 *
 * 1. Use Optional as a return type when a result may be absent.
 * 2. Never return null from a method that promises to return Optional.
 * 3. Use Optional.of() when the value must not be null.
 * 4. Use Optional.ofNullable() when wrapping a potentially null value.
 * 5. Use map() to transform a value and flatMap() to chain operations
 *    that already return Optional.
 * 6. Use orElseGet() when calculating a fallback should be lazy.
 * 7. Use orElseThrow() when a value is required and absence is an error.
 * 8. Avoid calling get() without first establishing that the Optional
 *    is present. Prefer operations that express the intended behavior.
 * 9. Avoid using Optional for every field, method parameter, or local
 *    variable. It is not intended to replace all nullable references.
 * 10. Prefer an empty collection over Optional<List<T>> when an empty
 *     collection adequately represents the absence of results.
 *
 * Optional does not eliminate every possibility of NullPointerException.
 * It helps model absence explicitly when used consistently.
 */
public class _20_OptionalBestPractices {

    static void main(String[] args) {

        EmployeeRepository repository = new EmployeeRepository();

        /*
         * Best practice 1: Represent expected absence explicitly.
         */
        Optional<Employee> employee = repository.findById("EMP-001");

        System.out.println(
                "Employee found: " + employee.isPresent()
        );

        /*
         * Best practice 2: Avoid returning null from an Optional method.
         *
         * A method returning Optional<Employee> should return either
         * Optional.of(employee) or Optional.empty(), never null.
         *
         * A caller can then rely on the declared contract.
         */

        /*
         * Best practice 3: Use ofNullable() for legacy nullable results.
         */
        Optional<Employee> legacyEmployee =
                repository.findByIdUsingLegacyApi("EMP-999");

        System.out.println(
                "Legacy lookup: "
                        + legacyEmployee.map(Employee::name)
                        .orElse("Employee not found")
        );

        /*
         * Best practice 4: Prefer map() to manual extraction.
         *
         * map() transforms the value only when it is present.
         */
        String name = employee
                .map(Employee::name)
                .orElse("Unknown Employee");

        System.out.println("Name: " + name);

        /*
         * Best practice 5: Use orElseGet() for lazy fallback evaluation.
         *
         * The fallback method is called only when the Optional is empty.
         * This matters when creating the fallback is expensive or has
         * side effects.
         */
        String fallbackName = repository.findById("EMP-999")
                .map(Employee::name)
                .orElseGet(() -> createFallbackName());

        System.out.println("Fallback name: " + fallbackName);

        /*
         * Best practice 6: Use orElseThrow() when absence is exceptional.
         *
         * If the Employee is missing, the specified exception is thrown.
         */
        try {
            Employee requiredEmployee = repository.findById("EMP-999")
                    .orElseThrow(
                            () -> new IllegalStateException(
                                    "Required Employee does not exist."
                            )
                    );

            System.out.println(requiredEmployee.name());

        } catch (IllegalStateException exception) {
            System.out.println(exception.getMessage());
        }

        /*
         * Best practice 7: Avoid unnecessary Optional wrapping.
         *
         * Optional<Employee> is useful as a return type.
         * An ordinary Employee variable is sufficient once the value
         * has been successfully retrieved.
         */
        Employee existingEmployee = repository.findById("EMP-001")
                .orElseThrow();

        System.out.println(
                "Retrieved employee: " + existingEmployee.name()
        );
    }

    private static String createFallbackName() {
        System.out.println("Creating fallback name...");
        return "Unknown Employee";
    }

    record Employee(String id, String name, String department) {

    }

    static class EmployeeRepository {

        /*
         * A repository retrieves Employees from a data source.
         *
         * Returning Optional<Employee> communicates that an Employee
         * with the requested ID might not exist.
         */
        public Optional<Employee> findById(String id) {

            if ("EMP-001".equals(id)) {
                return Optional.of(
                        new Employee(
                                "EMP-001",
                                "Alex",
                                "Engineering"
                        )
                );
            }

            return Optional.empty();
        }

        /*
         * This method simulates retrieving a value from a legacy API
         * that may return null.
         *
         * Wrapping that result with Optional.ofNullable() at the
         * boundary converts the nullable value into an explicit result.
         */
        private Employee findLegacyEmployee(String id) {

            if ("EMP-001".equals(id)) {
                return new Employee(
                        "EMP-001",
                        "Alex",
                        "Engineering"
                );
            }

            return null;
        }

        public Optional<Employee> findByIdUsingLegacyApi(String id) {
            return Optional.ofNullable(findLegacyEmployee(id));
        }
    }
}