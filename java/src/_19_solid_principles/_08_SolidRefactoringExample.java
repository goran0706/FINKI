package _19_solid_principles;

/*
 * SOLID REFACTORING EXAMPLE
 *
 * This example takes a small employee-processing application and refactors it
 * incrementally toward a design that follows SOLID principles.
 *
 * The application must:
 * 1. Calculate an employee's bonus.
 * 2. Save the employee.
 * 3. Generate a report.
 * 4. Send a notification.
 *
 * The objective is not to create the most sophisticated architecture possible.
 * It is to understand how responsibilities and dependencies can be organized.
 *
 * SOLID PRINCIPLES:
 *
 * S — Single Responsibility Principle:
 *     Each class has one primary responsibility.
 *
 * O — Open/Closed Principle:
 *     New bonus policies can be introduced without modifying the calculation
 *     algorithm or adding new conditional branches to it.
 *
 * L — Liskov Substitution Principle:
 *     Implementations of an abstraction must honor the behavior expected
 *     by its consumers.
 *
 * I — Interface Segregation Principle:
 *     Consumers should depend only on the capabilities they need.
 *
 * D — Dependency Inversion Principle:
 *     High-level business logic depends on abstractions rather than concrete
 *     infrastructure implementations.
 *
 * Note:
 * LSP is demonstrated through the contracts of the interfaces in this example.
 * The principle becomes particularly important when implementations have
 * different behavioral constraints.
 */

public class _08_SolidRefactoringExample {

    static void main(String[] args) {

        /*
         * STEP 1: CREATE THE EMPLOYEE.
         *
         * Employee is a domain object. It represents business data rather than
         * knowing how that data is stored, reported, or communicated.
         */
        Employee employee = new Employee("Alice", 5000, EmployeeType.FULL_TIME);

        /*
         * STEP 2: CONFIGURE THE APPLICATION'S DEPENDENCIES.
         *
         * These are concrete implementations supplied from outside the
         * EmployeeService.
         *
         * In a larger application, a dependency injection container could
         * create and configure these objects automatically.
         */
        BonusPolicy bonusPolicy = new FullTimeBonusPolicy();

        EmployeeRepository repository = new ConsoleEmployeeRepository();

        EmployeeReportGenerator reportGenerator = new ConsoleEmployeeReportGenerator();

        NotificationSender notificationSender = new ConsoleNotificationSender();

        /*
         * STEP 3: CONSTRUCT THE APPLICATION SERVICE.
         *
         * The service receives abstractions, not specific implementations.
         * Its workflow remains independent of the technical details.
         */
        EmployeeService employeeService = new EmployeeService(bonusPolicy, repository, reportGenerator, notificationSender);

        /*
         * STEP 4: EXECUTE THE BUSINESS WORKFLOW.
         */
        employeeService.process(employee);

        /*
         * STEP 5: CHANGE AN IMPLEMENTATION WITHOUT CHANGING THE SERVICE.
         *
         * A contractor needs a different bonus policy.
         * The same EmployeeService can use that policy.
         */
        Employee contractor = new Employee("Bob", 4000, EmployeeType.CONTRACTOR);

        EmployeeService contractorService = new EmployeeService(new ContractorBonusPolicy(), repository, reportGenerator, notificationSender);

        contractorService.process(contractor);
    }

    enum EmployeeType {
        FULL_TIME, CONTRACTOR
    }

    /*
     * BONUS POLICY ABSTRACTION
     *
     * OCP:
     * EmployeeService uses this contract instead of implementing every bonus
     * formula itself.
     *
     * A new policy can be added by implementing this interface.
     */
    interface BonusPolicy {

        double calculateBonus(Employee employee);
    }

    /*
     * PERSISTENCE ABSTRACTION
     *
     * DIP:
     * The application service needs to save an employee, but it does not need
     * to know whether the employee is saved to a database, a file, or another
     * storage system.
     */
    interface EmployeeRepository {

        void save(Employee employee);
    }

    /*
     * REPORTING ABSTRACTION
     *
     * Reporting is separate from the application workflow.
     * This interface allows different report-generation implementations.
     */
    interface EmployeeReportGenerator {

        void generate(Employee employee, double bonus);
    }

    /*
     * NOTIFICATION ABSTRACTION
     *
     * ISP:
     * The application needs the ability to send a notification.
     *
     * It does not need to depend on unrelated operations such as printing,
     * scanning, or faxing.
     */
    interface NotificationSender {

        void send(String message);
    }

    /*
     * DOMAIN MODEL
     *
     * SRP:
     * Employee represents employee data.
     *
     * It does not calculate bonuses, save itself to a database, format reports,
     * or send notifications.
     */
    record Employee(String name, double salary, EmployeeType type) {

    }

    /*
     * CONCRETE BONUS POLICY
     *
     * This implementation calculates a 10% bonus.
     *
     * It can be replaced without changing EmployeeService.
     */
    static class FullTimeBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.salary() * 0.10;
        }
    }

    /*
     * ANOTHER CONCRETE BONUS POLICY
     *
     * This implementation calculates a 5% bonus.
     *
     * Both policies honor the same contract: given an employee, calculate
     * and return that employee's bonus.
     *
     * EmployeeService can use either implementation through BonusPolicy.
     */
    static class ContractorBonusPolicy implements BonusPolicy {

        @Override
        public double calculateBonus(Employee employee) {
            return employee.salary() * 0.05;
        }
    }

    /*
     * CONCRETE PERSISTENCE IMPLEMENTATION
     *
     * This implementation prints a message instead of using a real database.
     *
     * A production implementation could use JDBC, JPA, or another persistence
     * technology without requiring EmployeeService to depend on that technology.
     */
    static class ConsoleEmployeeRepository implements EmployeeRepository {

        @Override
        public void save(Employee employee) {
            System.out.println("Saving employee: " + employee.name());
        }
    }

    /*
     * CONCRETE REPORT GENERATOR
     *
     * This implementation writes the report to the console.
     */
    static class ConsoleEmployeeReportGenerator implements EmployeeReportGenerator {

        @Override
        public void generate(Employee employee, double bonus) {
            System.out.println("Employee report: " + employee.name() + ", salary: " + employee.salary() + ", bonus: " + bonus);
        }
    }

    /*
     * CONCRETE NOTIFICATION IMPLEMENTATION
     *
     * This implementation simulates sending a notification.
     * A real implementation could use email, SMS, or a messaging provider.
     */
    static class ConsoleNotificationSender implements NotificationSender {

        @Override
        public void send(String message) {
            System.out.println("Notification: " + message);
        }
    }

    /*
     * APPLICATION SERVICE
     *
     * This class coordinates the employee-processing workflow.
     *
     * Its responsibilities are limited to orchestration:
     * 1. Calculate the bonus using the supplied policy.
     * 2. Save the employee through the repository abstraction.
     * 3. Generate a report through the reporting abstraction.
     * 4. Send a notification through the notification abstraction.
     *
     * DIP:
     * All dependencies are abstractions.
     *
     * SRP:
     * The service coordinates the workflow; it does not implement the bonus
     * formula, persistence mechanism, report formatting, or delivery mechanism.
     *
     * Constructor injection:
     * Dependencies are supplied when the service is constructed, rather than
     * created internally with expressions such as new ConsoleEmployeeRepository().
     */
    static class EmployeeService {

        private final BonusPolicy bonusPolicy;
        private final EmployeeRepository repository;
        private final EmployeeReportGenerator reportGenerator;
        private final NotificationSender notificationSender;

        EmployeeService(BonusPolicy bonusPolicy, EmployeeRepository repository, EmployeeReportGenerator reportGenerator, NotificationSender notificationSender) {
            this.bonusPolicy = bonusPolicy;
            this.repository = repository;
            this.reportGenerator = reportGenerator;
            this.notificationSender = notificationSender;
        }

        public void process(Employee employee) {

            double bonus = bonusPolicy.calculateBonus(employee);

            repository.save(employee);

            reportGenerator.generate(employee, bonus);

            notificationSender.send("Employee " + employee.name() + " was processed.");
        }
    }
}

/*
 * FINAL OBSERVATIONS
 *
 * 1. SRP is about reasons to change, not simply about making classes small.
 *    Each collaborator here represents a distinct responsibility or boundary.
 *
 * 2. OCP does not mean that existing code can never change.
 *    It means that anticipated variations can often be handled by adding
 *    implementations instead of repeatedly modifying stable business logic.
 *
 * 3. LSP requires behavioral compatibility, not merely implementing an
 *    interface or extending a class. Implementations must honor the contract
 *    consumers rely on.
 *
 * 4. ISP keeps interfaces focused on the needs of their consumers.
 *
 * 5. DIP separates business policy from implementation details.
 *    Constructor injection is the technique used here to supply dependencies.
 *
 * 6. SOLID principles support one another, but they are not identical.
 *    A design can follow DIP and still violate SRP, or follow SRP and still
 *    be tightly coupled to concrete implementations.
 *
 * 7. More abstractions are not automatically better.
 *    Use them where they create meaningful separation, improve testability,
 *    or isolate likely sources of change.
 *
 * 8. This is an educational example. It omits production concerns such as
 *    monetary precision, transaction boundaries, error handling, validation,
 *    logging, and reliable notification delivery.
 */