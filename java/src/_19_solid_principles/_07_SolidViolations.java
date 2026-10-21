package _19_solid_principles;

/*
 * SOLID VIOLATIONS
 *
 * This example combines several SOLID violations in one small application.
 * The goal is to recognize problematic dependencies and responsibilities,
 * not to introduce new principles.
 *
 * The five SOLID principles:
 *
 * S — Single Responsibility Principle
 * O — Open/Closed Principle
 * L — Liskov Substitution Principle
 * I — Interface Segregation Principle
 * D — Dependency Inversion Principle
 *
 * The first implementation intentionally violates these principles.
 * The second implementation demonstrates improvements.
 */

public class _07_SolidViolations {

    static void main(String[] args) {

        /*
         * VIOLATION: MULTIPLE RESPONSIBILITIES AND CONCRETE DEPENDENCIES
         *
         * This class calculates salaries, saves employees, generates reports,
         * and sends notifications.
         *
         * It also directly constructs its infrastructure dependencies.
         */
        BadEmployeeManager badManager = new BadEmployeeManager();

        badManager.processEmployee("Alice", 5000, "FULL_TIME");

        /*
         * IMPROVED DESIGN
         *
         * Responsibilities are separated into focused classes.
         * The manager depends on abstractions for persistence and notification.
         */
        Employee employee = new Employee("Bob", 6000, EmployeeType.FULL_TIME);

        EmployeeRepository repository = new InMemoryEmployeeRepository();
        NotificationService notificationService = new ConsoleNotificationService();

        EmployeeService employeeService =
                new EmployeeService(repository, notificationService);

        employeeService.processEmployee(employee);
    }

    enum EmployeeType {
        FULL_TIME,
        CONTRACTOR
    }

    /*
     * OPEN/CLOSED IMPROVEMENT
     *
     * The bonus policy is an abstraction.
     * Each policy defines its own calculation.
     *
     * New policies can be introduced without adding another conditional
     * branch to EmployeeService.
     */
    interface BonusPolicy {

        double calculateBonus(Employee employee);
    }

    /*
     * DEPENDENCY INVERSION IMPROVEMENT
     *
     * EmployeeRepository describes the persistence capability required
     * by the application.
     *
     * EmployeeService depends on this abstraction rather than a concrete
     * database implementation.
     */
    interface EmployeeRepository {

        void save(Employee employee);
    }

    /*
     * INTERFACE SEGREGATION
     *
     * NotificationService exposes only the capability required here.
     * The employee service does not depend on unrelated capabilities such
     * as scanning documents or generating reports.
     */
    interface NotificationService {

        void notifyEmployee(Employee employee);
    }

    /*
     * VIOLATION EXAMPLE
     *
     * This class has several reasons to change:
     *
     * - Salary calculation rules change.
     * - Database persistence changes.
     * - Report formatting changes.
     * - Notification delivery changes.
     * - A new employee type is introduced.
     *
     * These are separate responsibilities bundled into one class.
     */
    static class BadEmployeeManager {

        public void processEmployee(
                String name,
                double salary,
                String employeeType
        ) {
            double bonus;

            /*
             * OPEN/CLOSED VIOLATION
             *
             * Adding a new employee type requires modifying this method.
             * As the number of types grows, conditional logic can become
             * increasingly difficult to maintain.
             */
            if (employeeType.equals("FULL_TIME")) {
                bonus = salary * 0.10;
            } else if (employeeType.equals("CONTRACTOR")) {
                bonus = salary * 0.05;
            } else {
                bonus = 0;
            }

            System.out.println("Calculated bonus: " + bonus);

            /*
             * INFRASTRUCTURE COUPLING
             *
             * The business class directly implements its persistence behavior.
             * Replacing this with a database would require changing this class.
             */
            System.out.println("Saving employee to a database: " + name);

            /*
             * REPORTING IS ANOTHER RESPONSIBILITY.
             */
            System.out.println(
                    "Employee report: " + name + ", salary: " + salary
            );

            /*
             * NOTIFICATION DELIVERY IS YET ANOTHER RESPONSIBILITY.
             */
            System.out.println("Sending email to notify about " + name);
        }
    }

    /*
         * DOMAIN MODEL
         *
         * Employee represents employee data and its basic domain identity.
         * It does not handle persistence, reporting, or notification delivery.
         */
        record Employee(String name, double salary, EmployeeType type) {

    }

    static class FullTimeBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.salary() * 0.10;
        }
    }

    static class ContractorBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.salary() * 0.05;
        }
    }

    static class InMemoryEmployeeRepository implements EmployeeRepository {

        @Override
        public void save(Employee employee) {
            System.out.println(
                    "Saving employee in memory: " + employee.name()
            );
        }
    }

    static class ConsoleNotificationService implements NotificationService {

        @Override
        public void notifyEmployee(Employee employee) {
            System.out.println(
                    "Notification sent for employee: " + employee.name()
            );
        }
    }

    /*
     * SINGLE RESPONSIBILITY IMPROVEMENT
     *
     * EmployeeReporter handles report formatting separately from business
     * orchestration, persistence, and notification delivery.
     */
    static class EmployeeReporter {

        public void printReport(Employee employee, double bonus) {
            System.out.println(
                    "Employee report: "
                            + employee.name()
                            + ", salary: "
                            + employee.salary()
                            + ", bonus: "
                            + bonus
            );
        }
    }

    /*
     * IMPROVED APPLICATION SERVICE
     *
     * This class coordinates the workflow.
     *
     * Its dependencies are supplied through the constructor:
     * - EmployeeRepository for persistence.
     * - NotificationService for notification delivery.
     *
     * The bonus policies and reporter are also separate collaborators.
     *
     * For simplicity, this example selects the bonus policy using a switch.
     * In a larger application, a policy registry or injected policy map
     * could remove even this selection logic from the service.
     */
    static class EmployeeService {

        private final EmployeeRepository repository;
        private final NotificationService notificationService;
        private final EmployeeReporter reporter;

        EmployeeService(
                EmployeeRepository repository,
                NotificationService notificationService
        ) {
            this.repository = repository;
            this.notificationService = notificationService;
            this.reporter = new EmployeeReporter();
        }

        public void processEmployee(Employee employee) {

            BonusPolicy bonusPolicy = switch (employee.type()) {
                case FULL_TIME -> new FullTimeBonusPolicy();
                case CONTRACTOR -> new ContractorBonusPolicy();
            };

            double bonus = bonusPolicy.calculateBonus(employee);

            repository.save(employee);

            reporter.printReport(employee, bonus);

            notificationService.notifyEmployee(employee);
        }
    }
}

/*
 * WHAT THIS EXAMPLE DEMONSTRATES
 *
 * 1. SRP:
 *    Separate salary policy, persistence, reporting, notification, and
 *    workflow coordination instead of combining them in one class.
 *
 * 2. OCP:
 *    Represent bonus calculations as policies. The switch in EmployeeService
 *    is still a selection point, so this simplified design is not completely
 *    closed to modification when new employee types are introduced.
 *
 * 3. LSP:
 *    This example does not demonstrate an inheritance-substitution violation.
 *    LSP is best understood through a separate example where a subtype cannot
 *    safely honor the behavior promised by its parent type.
 *
 * 4. ISP:
 *    Depend on focused interfaces containing only the operations a consumer
 *    actually needs.
 *
 * 5. DIP:
 *    Make the application service depend on abstractions rather than concrete
 *    infrastructure implementations.
 *
 * IMPORTANT:
 *
 * SOLID does not require creating an interface and a class for every operation.
 * The objective is to control coupling and isolate reasons for change.
 * Add abstractions when they create a useful boundary, not merely to increase
 * the number of files or types.
 *
 * This is a teaching example, not a complete production implementation.
 */