package _08_generics;

/*
 * GENERIC CLASSES
 *
 * A generic class declares one or more type parameters after its name.
 *
 * The type parameter T represents the type of data the class works with.
 * The actual type is supplied when an object is created.
 *
 * A generic class can be reused with different types while maintaining
 * compile-time type safety.
 */
public class _02_GenericClasses {

    static void main(String[] args) {

        // This account stores its balance as a Double.
        BankAccount<Double> euroAccount =
                new BankAccount<>("ACC-001", 1250.50);

        System.out.println(euroAccount.getAccountNumber());
        System.out.println(euroAccount.getBalance());

        euroAccount.setBalance(1500.75);
        System.out.println(euroAccount.getBalance());

        // This account stores its balance as an Integer.
        // This is only a demonstration of generics, not a recommended
        // representation for real monetary values.
        BankAccount<Integer> pointsAccount =
                new BankAccount<>("ACC-002", 100);

        System.out.println(pointsAccount.getBalance());

        // The compiler rejects values that do not match the type parameter.
        // euroAccount.setBalance("1500.75"); // Compilation error.
    }

    static class BankAccount<T> {

        private final String accountNumber;
        private T balance;

        public BankAccount(String accountNumber, T balance) {
            this.accountNumber = accountNumber;
            this.balance = balance;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public T getBalance() {
            return balance;
        }

        public void setBalance(T balance) {
            this.balance = balance;
        }
    }
}