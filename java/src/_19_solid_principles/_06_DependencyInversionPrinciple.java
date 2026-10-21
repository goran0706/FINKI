package _19_solid_principles;

/*
 * DEPENDENCY INVERSION PRINCIPLE (DIP)
 *
 * Definition:
 *
 * 1. High-level modules should not depend on low-level modules.
 *    Both should depend on abstractions.
 *
 * 2. Abstractions should not depend on details.
 *    Details should depend on abstractions.
 *
 * In simpler terms:
 * Business logic should not be tightly coupled to specific technical
 * implementations such as a database, email provider, or file system.
 *
 * ------------------------------------------------------------
 * HIGH-LEVEL AND LOW-LEVEL MODULES
 * ------------------------------------------------------------
 *
 * A high-level module expresses business policy or application behavior.
 *
 * Example:
 * OrderService decides what should happen when an order is placed.
 *
 * A low-level module performs a technical operation.
 *
 * Example:
 * EmailNotification sends a notification through an email provider.
 *
 * Without DIP, OrderService directly constructs and depends on EmailNotification.
 * Replacing email notifications with SMS notifications then requires changing
 * the business service.
 *
 * With DIP, OrderService depends on a NotificationService abstraction.
 * Concrete notification implementations implement that abstraction.
 *
 * The high-level module no longer needs to know which implementation is used.
 *
 * ------------------------------------------------------------
 * IMPORTANT: DIP VS. DEPENDENCY INJECTION
 * ------------------------------------------------------------
 *
 * Dependency Inversion Principle (DIP):
 * An architectural principle about the direction of dependencies.
 *
 * Dependency Injection (DI):
 * A technique for supplying an object's dependencies from outside that object.
 *
 * DI is one way to implement DIP, but the terms are not interchangeable.
 *
 * This example uses constructor injection to supply the dependency.
 */

public class _06_DependencyInversionPrinciple {

    static void main(String[] args) {

        /*
         * VIOLATION EXAMPLE
         *
         * OrderService directly constructs EmailNotification.
         * It is coupled to a specific implementation.
         */
        OldOrderService oldOrderService = new OldOrderService();

        oldOrderService.placeOrder("ORD-1001");

        /*
         * CORRECTED DESIGN
         *
         * OrderService depends on NotificationService, an abstraction.
         *
         * The caller supplies the concrete implementation through the
         * constructor. The service does not construct that implementation.
         */
        NotificationService emailNotification = new EmailNotification();

        OrderService orderService = new OrderService(emailNotification);

        orderService.placeOrder("ORD-1002");

        /*
         * The same business service can use another implementation without
         * changing its business logic.
         */
        NotificationService smsNotification = new SmsNotification();

        OrderService anotherOrderService = new OrderService(smsNotification);

        anotherOrderService.placeOrder("ORD-1003");
    }

    /*
     * ABSTRACTION
     *
     * This interface describes the capability required by the business service.
     * It does not specify whether the notification is sent by email, SMS,
     * or another delivery mechanism.
     */
    interface NotificationService {

        void send(String message);
    }

    /*
     * VIOLATION EXAMPLE
     *
     * High-level business logic directly depends on a concrete low-level
     * implementation.
     */
    static class OldOrderService {

        private final EmailNotification notification =
                new EmailNotification();

        public void placeOrder(String orderId) {
            System.out.println("Placing order: " + orderId);

            notification.send("Order " + orderId + " was placed.");
        }
    }

    /*
     * LOW-LEVEL IMPLEMENTATION
     *
     * This class implements the abstraction using email.
     */
    static class EmailNotification implements NotificationService {

        @Override
        public void send(String message) {
            System.out.println("Sending email: " + message);
        }
    }

    /*
     * ANOTHER LOW-LEVEL IMPLEMENTATION
     *
     * This class implements the same abstraction using SMS.
     */
    static class SmsNotification implements NotificationService {

        @Override
        public void send(String message) {
            System.out.println("Sending SMS: " + message);
        }
    }

    /*
     * HIGH-LEVEL MODULE
     *
     * OrderService contains business behavior.
     *
     * It depends on NotificationService rather than EmailNotification
     * or SmsNotification.
     *
     * Constructor injection makes the dependency explicit and ensures that
     * the service receives its required dependency when it is created.
     */
    static class OrderService {

        private final NotificationService notificationService;

        OrderService(NotificationService notificationService) {
            this.notificationService = notificationService;
        }

        public void placeOrder(String orderId) {
            System.out.println("Placing order: " + orderId);

            notificationService.send(
                    "Order " + orderId + " was placed."
            );
        }
    }
}

/*
 * IMPORTANT DISTINCTIONS
 *
 * 1. DIP does not mean that business logic must never use concrete classes.
 *    It means important policy should not be unnecessarily coupled to
 *    implementation details.
 *
 * 2. The interface is owned by the consumer's requirements in this example:
 *    OrderService needs the ability to send a notification.
 *
 * 3. The concrete implementations depend on the abstraction by implementing
 *    NotificationService. The high-level service also depends on that
 *    abstraction. Neither needs a direct source-code dependency on the other.
 *
 * 4. Constructor injection makes dependencies visible and easier to replace
 *    in tests. A test can supply a fake NotificationService without using
 *    a real email or SMS provider.
 *
 * 5. A dependency injection framework, such as Spring, can automate the
 *    creation and wiring of these objects. A framework is not required
 *    to apply DIP or use constructor injection.
 *
 * 6. An interface is not automatically useful merely because it exists.
 *    Introduce abstractions where they reduce meaningful coupling, support
 *    alternative implementations, or establish a stable architectural boundary.
 *
 * 7. DIP is especially valuable at boundaries between business logic and
 *    infrastructure: databases, external APIs, messaging systems, file storage,
 *    payment providers, and notification services.
 */