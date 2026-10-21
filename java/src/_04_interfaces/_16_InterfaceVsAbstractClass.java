package _04_interfaces;

/*
 * INTERFACE VS ABSTRACT CLASS
 *
 * Both interfaces and abstract classes support abstraction, but they
 * serve different purposes.
 *
 * INTERFACE:
 * - Defines a contract that classes agree to fulfill.
 * - A class can implement multiple interfaces.
 * - Cannot have instance fields.
 * - Can declare abstract, default, static, and private methods.
 *
 * ABSTRACT CLASS:
 * - Can provide shared state and implementation for related classes.
 * - A class can extend only one class.
 * - Can have constructors, instance fields, and concrete methods.
 * - Can declare abstract methods that subclasses must implement.
 */
public class _16_InterfaceVsAbstractClass {

    static void main(String[] args) {

        CheckingAccount account = new CheckingAccount(500.00);

        // Abstract-class functionality provides shared account state.
        System.out.println("Initial balance: " + account.getBalance());

        // Interface functionality provides the transfer contract.
        account.transfer(150.00);

        System.out.println("Remaining balance: " + account.getBalance());
    }

    interface Transferable {
        void transfer(double amount);
    }

    abstract static class BankAccount {

        private double balance;

        public BankAccount(double initialBalance) {
            this.balance = initialBalance;
        }

        public double getBalance() {
            return balance;
        }

        protected void deduct(double amount) {
            balance -= amount;
        }
    }

    static class CheckingAccount extends BankAccount implements Transferable {

        public CheckingAccount(double initialBalance) {
            super(initialBalance);
        }

        @Override
        public void transfer(double amount) {
            if (amount <= 0 || amount > getBalance()) {
                System.out.println("Invalid transfer amount.");
                return;
            }

            deduct(amount);
            System.out.println("Transferred: " + amount);
        }
    }
}