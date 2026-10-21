package _19_solid_principles;

/*
 * OPEN/CLOSED PRINCIPLE (OCP)
 *
 * Definition:
 * Software entities (classes, modules, functions) should be:
 *
 * - Open for extension: new behavior can be added.
 * - Closed for modification: existing, stable code should not need to be
 *   repeatedly modified whenever new behavior is introduced.
 *
 * The goal is to make changing requirements easier to accommodate while
 * reducing the risk of breaking existing functionality.
 *
 * OCP does not mean existing code must never change.
 * Bugs, incorrect abstractions, and changing requirements can still require
 * modifications. The principle encourages designs that provide appropriate
 * extension points for anticipated variations.
 *
 * ------------------------------------------------------------
 * VIOLATION
 * ------------------------------------------------------------
 *
 * Imagine an application that calculates employee bonuses.
 *
 * Initially, the application supports full-time employees.
 * Later, it must also support contractors and managers.
 *
 * A common implementation uses conditional statements:
 *
 * if (employeeType.equals("FULL_TIME")) {
 *     ...
 * } else if (employeeType.equals("CONTRACTOR")) {
 *     ...
 * }
 *
 * Every new employee type requires modifying the same calculation method.
 * As the number of types grows, the method becomes harder to maintain.
 *
 * ------------------------------------------------------------
 * SOLUTION
 * ------------------------------------------------------------
 *
 * Define a BonusPolicy abstraction.
 *
 * Each implementation provides its own bonus calculation.
 *
 * The calculator depends on the abstraction rather than checking concrete
 * employee types.
 *
 * Adding a new bonus policy requires creating another implementation,
 * without changing the existing calculator.
 */

public class _03_OpenClosedPrinciple {

    static void main(String[] args) {

        Employee alice = new Employee("Alice", 5000);
        Employee bob = new Employee("Bob", 5000);

        // VIOLATION: adding another employee type requires modifying
        // this conditional calculation method.
        BonusCalculatorWithConditionals oldCalculator =
                new BonusCalculatorWithConditionals();

        System.out.println(
                "Conditional bonus: "
                        + oldCalculator.calculateBonus(alice, "FULL_TIME")
        );

        // SOLUTION: the calculator accepts any BonusPolicy implementation.
        BonusPolicy fullTimePolicy = new FullTimeBonusPolicy();
        BonusPolicy contractorPolicy = new ContractorBonusPolicy();

        BonusCalculator calculator = new BonusCalculator();

        System.out.println(
                "Full-time bonus: "
                        + calculator.calculateBonus(alice, fullTimePolicy)
        );

        System.out.println(
                "Contractor bonus: "
                        + calculator.calculateBonus(bob, contractorPolicy)
        );

        // A new policy can be added without modifying BonusCalculator.
        BonusPolicy managerPolicy = new ManagerBonusPolicy();

        System.out.println(
                "Manager bonus: "
                        + calculator.calculateBonus(alice, managerPolicy)
        );
    }

    /*
     * Extension point.
     *
     * The calculator only needs to know that a policy can calculate a bonus.
     * It does not need to know how each policy performs the calculation.
     */
    interface BonusPolicy {

        double calculateBonus(Employee employee);
    }

    record Employee(String name, double monthlySalary) {

    }

    /*
     * VIOLATION EXAMPLE
     *
     * The calculator knows every supported employee type.
     *
     * Each new type requires a modification to this class.
     */
    static class BonusCalculatorWithConditionals {

        public double calculateBonus(Employee employee, String employeeType) {

            if ("FULL_TIME".equals(employeeType)) {
                return employee.monthlySalary() * 0.10;
            }

            if ("CONTRACTOR".equals(employeeType)) {
                return employee.monthlySalary() * 0.05;
            }

            throw new IllegalArgumentException(
                    "Unsupported employee type: " + employeeType
            );
        }
    }

    static class FullTimeBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.monthlySalary() * 0.10;
        }
    }

    static class ContractorBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.monthlySalary() * 0.05;
        }
    }

    static class ManagerBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.monthlySalary() * 0.20;
        }
    }

    /*
     * This class is closed to changes caused by new bonus policies.
     *
     * It delegates the calculation to the supplied implementation.
     * Adding another BonusPolicy does not require changing this class.
     */
    static class BonusCalculator {

        public double calculateBonus(
                Employee employee,
                BonusPolicy policy
        ) {
            return policy.calculateBonus(employee);
        }
    }
}

/*
 * IMPORTANT DISTINCTIONS
 *
 * 1. OCP does not prohibit conditional statements.
 *    Conditionals are often appropriate for simple or stable requirements.
 *
 * 2. The problem is repeated modification of existing code whenever a new
 *    variation is introduced.
 *
 * 3. Interfaces, composition, inheritance, and dependency injection can provide
 *    extension points. Choose the simplest mechanism that fits the problem.
 *
 * 4. Do not create abstractions for every hypothetical future requirement.
 *    Introduce them when meaningful variation exists or is reasonably expected.
 *
 * 5. This example uses polymorphism to achieve OCP. The same idea appears in
 *    strategies, plugins, payment providers, notification channels, and
 *    other systems where new behavior should be introduced independently.
 */