package _19_solid_principles;

/*
 * SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 *
 * Definition:
 * A class should have one responsibility and one reason to change.
 *
 * The key idea is not that a class can have only one method.
 * A class may contain many methods as long as they belong to the same
 * cohesive responsibility.
 *
 * A "reason to change" means a distinct source of change in requirements.
 *
 * For example:
 * - Employee information changes because employee-related requirements change.
 * - Salary calculation changes because compensation rules change.
 * - Database persistence changes because storage requirements change.
 *
 * These are different responsibilities, even if they all concern employees.
 *
 * ------------------------------------------------------------
 * VIOLATION
 * ------------------------------------------------------------
 *
 * EmployeeManager below has several unrelated responsibilities:
 *
 * 1. Representing employee information.
 * 2. Calculating salary.
 * 3. Saving employee data.
 * 4. Formatting a report.
 *
 * If the database, salary rules, or report format changes, this class must
 * change for different reasons.
 *
 * ------------------------------------------------------------
 * SOLUTION
 * ------------------------------------------------------------
 *
 * Separate the responsibilities into cohesive classes:
 *
 * Employee          -> employee data
 * SalaryCalculator  -> salary calculations
 * EmployeeRepository -> persistence
 * EmployeeReporter  -> report formatting
 *
 * EmployeeRepository is only a simplified example of persistence.
 * It does not implement a real database.
 */

public class _02_SingleResponsibilityPrinciple {

    static void main(String[] args) {

        Employee employee = new Employee("Alice", 5000.00);

        // Each class handles a distinct responsibility.
        SalaryCalculator salaryCalculator = new SalaryCalculator();
        EmployeeRepository repository = new EmployeeRepository();
        EmployeeReporter reporter = new EmployeeReporter();

        double annualSalary =
                salaryCalculator.calculateAnnualSalary(employee);

        repository.save(employee);

        String report = reporter.createReport(employee, annualSalary);

        System.out.println(report);
    }

    /*
     * VIOLATION EXAMPLE
     *
     * This class combines employee data, salary calculations, persistence,
     * and report formatting.
     *
     * It is intentionally included to illustrate the design problem.
     */
    static class EmployeeManager {

        private final String name;
        private final double monthlySalary;

        EmployeeManager(String name, double monthlySalary) {
            this.name = name;
            this.monthlySalary = monthlySalary;
        }

        public double calculateAnnualSalary() {
            return monthlySalary * 12;
        }

        public void saveToDatabase() {
            // Database-related implementation would go here.
            System.out.println("Saving employee to database...");
        }

        public String generateReport() {
            return "Employee: " + name
                    + ", Annual salary: " + calculateAnnualSalary();
        }
    }

    /*
         * Employee represents employee information.
         *
         * Its responsibility is to hold employee-related state and expose
         * appropriate operations for that state.
         */
        record Employee(String name, double monthlySalary) {

    }

    /*
     * SalaryCalculator owns the salary calculation rule.
     *
     * If annual salary calculation changes, this is the natural place
     * to make that change.
     */
    static class SalaryCalculator {

        public double calculateAnnualSalary(Employee employee) {
            return employee.monthlySalary() * 12;
        }
    }

    /*
     * EmployeeRepository represents the persistence responsibility.
     *
     * In a real application, this class might communicate with a database.
     * Here, it only prints a message to keep the example focused.
     */
    static class EmployeeRepository {

        public void save(Employee employee) {
            System.out.println(
                    "Saving employee: " + employee.name()
            );
        }
    }

    /*
     * EmployeeReporter owns report formatting.
     *
     * A change to the report layout does not require modifying Employee
     * or SalaryCalculator.
     */
    static class EmployeeReporter {

        public String createReport(Employee employee, double annualSalary) {
            return "Employee: " + employee.name()
                    + ", Annual salary: " + annualSalary;
        }
    }
}

/*
 * IMPORTANT DISTINCTIONS
 *
 * 1. SRP does not mean one method per class.
 *    A class can have many methods that support the same responsibility.
 *
 * 2. SRP does not mean creating a separate class for every operation.
 *    Classes should represent meaningful, cohesive responsibilities.
 *
 * 3. Separate responsibilities when they change for different reasons.
 *    This reduces the chance that an unrelated change breaks existing behavior.
 *
 * 4. SRP is about cohesion, not merely class size.
 *    A small class can still have multiple unrelated responsibilities.
 *
 * 5. The goal is not to eliminate all dependencies between classes.
 *    The goal is to make each class's purpose clear and limit unrelated reasons
 *    for changing it.
 */