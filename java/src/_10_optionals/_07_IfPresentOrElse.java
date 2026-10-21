package _10_optionals;

import java.util.Optional;

/*
 * IFPRESENTORELSE()
 *
 * Optional.ifPresentOrElse() executes one of two actions:
 *
 * 1. The first action runs when the Optional contains a value.
 * 2. The second action runs when the Optional is empty.
 *
 * Syntax:
 *     optional.ifPresentOrElse(
 *         value -> performAction(value),
 *         () -> performAlternativeAction()
 *     );
 *
 * The first argument is a Consumer<T>, which receives the value.
 * The second argument is a Runnable, which takes no arguments and
 * returns no result.
 *
 * This method was introduced in Java 9.
 */
public class _07_IfPresentOrElse {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(new Employee("EMP-001", "Alex"));
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> existingEmployee = findEmployee("EMP-001");
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        /*
         * Because the Optional contains an Employee, the first lambda runs.
         * The alternative action is ignored.
         */
        existingEmployee.ifPresentOrElse(
                employee -> System.out.println(
                        "Employee found: " + employee.name()
                ),
                () -> System.out.println("Employee not found.")
        );

        /*
         * Because the Optional is empty, the second lambda runs.
         * The action that receives an Employee is ignored.
         */
        missingEmployee.ifPresentOrElse(
                employee -> System.out.println(
                        "Employee found: " + employee.name()
                ),
                () -> System.out.println("Employee not found.")
        );

        /*
         * Use ifPresent() when only the present case needs an action.
         * Use ifPresentOrElse() when both present and empty cases
         * require explicit actions.
         *
         * Neither method returns a value.
         */
    }

    record Employee(String id, String name) {

    }
}