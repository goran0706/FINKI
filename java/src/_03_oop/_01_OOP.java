package _03_oop;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/*
 * OBJECT-ORIENTED PROGRAMMING (OOP)
 *
 * Object-oriented programming is a programming paradigm that organizes software
 * around objects. Objects combine state and behavior, and classes define the
 * types from which objects are created.
 *
 * A class defines a contract and controls how its state is created, observed,
 * and modified. Good object-oriented design assigns each object clear
 * responsibilities and protects the rules that must always remain true.
 *
 * FOUR FUNDAMENTAL OOP PRINCIPLES
 *
 * 1. ENCAPSULATION
 *
 * Encapsulation means keeping an object's state and the behavior that manages
 * that state together, while controlling how the rest of the program interacts
 * with the object.
 *
 * Access modifiers are one mechanism for implementing encapsulation, but
 * making every field private is not sufficient by itself.
 *
 * Proper encapsulation requires:
 *
 * - The class owns and controls its internal state.
 * - Callers interact through meaningful operations that express domain intent.
 * - Operations validate input and enforce business rules.
 * - The class prevents callers from placing the object in an invalid state.
 * - Implementation details can change without unnecessarily affecting callers.
 * - The public API exposes only the capabilities that callers actually need.
 *
 * Getters and setters are not automatically good encapsulation.
 *
 * A getter is appropriate when callers genuinely need to observe a value.
 * A setter is appropriate only when arbitrary replacement is a valid domain
 * operation. A setter that allows callers to change any field without
 * enforcing the domain rules exposes implementation rather than encapsulating it.
 *
 * Prefer operations such as deposit(), withdraw(), and close() over a generic
 * setBalance() method. These operations express intent and allow the object
 * to enforce the rules associated with each state transition.
 *
 * 2. ABSTRACTION
 *
 * Abstraction exposes a meaningful contract while hiding implementation details.
 *
 * - Interfaces define capabilities or contracts.
 * - Abstract classes can define shared state and behavior while leaving some
 *   behavior to subclasses.
 * - Callers can depend on abstractions instead of concrete implementations.
 * - Abstraction reduces coupling between a caller and the implementation.
 *
 * Abstraction answers: WHAT can this object do?
 * Encapsulation answers: HOW is its state protected and managed?
 *
 * 3. INHERITANCE
 *
 * Inheritance allows a class to extend another class and inherit accessible
 * members and behavior.
 *
 * - The existing class is the superclass; the extending class is the subclass.
 * - Java classes support single inheritance: a class can extend only one
 *   direct superclass.
 * - A subclass can specialize inherited behavior by overriding methods.
 * - Inheritance should represent a valid "is-a" relationship.
 * - Prefer composition when an object needs another object's capabilities
 *   without being a subtype of that object.
 *
 * 4. POLYMORPHISM
 *
 * Polymorphism allows different implementations to be used through a common
 * superclass or interface type.
 *
 * - A superclass or interface reference can refer to a compatible subtype.
 * - Overridden instance methods are dynamically dispatched according to the
 *   actual object's runtime class.
 * - The declared reference type determines which members are accessible
 *   at compile time.
 * - The actual object type determines which overridden implementation executes.
 *
 * ADDITIONAL OBJECT-ORIENTED CONCEPTS
 *
 * INVARIANTS
 *
 * An invariant is a condition that must remain true for an object to be valid.
 * The class is responsible for preserving its invariants across every public
 * operation that can affect its state.
 *
 * For a bank account, examples include:
 *
 * - The balance must never be negative.
 * - A closed account cannot accept deposits or withdrawals.
 * - An account number must be present and cannot change after creation.
 * - A withdrawal must not exceed the available balance.
 *
 * Constructors establish the initial invariants. Methods that change state
 * must preserve them. Validation must occur before committing a state change.
 *
 * COMPOSITION
 *
 * Composition models a "has-a" relationship. An object collaborates with
 * other objects to perform its responsibilities rather than inheriting
 * their implementation.
 *
 * METHOD OVERRIDING
 *
 * A subclass provides a compatible implementation of an inherited instance
 * method. Use @Override so the compiler verifies that the method overrides
 * a superclass or interface method.
 *
 * METHOD OVERLOADING
 *
 * Multiple methods share a name but have different parameter lists. The
 * compiler selects the applicable overload at compile time.
 *
 * CONSTRUCTORS
 *
 * Constructors establish an object's initial state. They are not inherited.
 * A constructor should reject invalid initial data rather than create an
 * object that violates its invariants.
 *
 * EXAMPLE DOMAIN: BANKING
 *
 * This example uses one domain to demonstrate the concepts together.
 *
 * - BankAccount encapsulates account state and enforces account invariants.
 * - SavingsAccount inherits from BankAccount and specializes withdrawals.
 * - TransactionFeePolicy defines a fee-calculation contract.
 * - FixedTransactionFee implements that contract.
 * - BankAccount uses composition to delegate fee calculation.
 * - Polymorphism allows different fee policies and account subtypes to be
 *   used through their common abstractions.
 *
 * This is an educational example, not a production banking implementation.
 * BigDecimal is used for monetary arithmetic instead of floating-point types.
 */

public class _01_OOP {

    static void main(String[] args) {

        TransactionFeePolicy feePolicy = new FixedTransactionFee(new BigDecimal("2.00"));

        BankAccount account = new CheckingAccount("ACC-1001", new BigDecimal("500.00"), feePolicy);

        SavingsAccount savings = new SavingsAccount("ACC-2001", new BigDecimal("1000.00"), feePolicy, new BigDecimal("200.00"));

        /*
         * ENCAPSULATION:
         *
         * Callers express domain intent through deposit() and withdraw().
         * They cannot assign the balance directly or bypass the account's
         * validation rules.
         *
         * There is deliberately no setBalance() method.
         */
        account.deposit(new BigDecimal("100.00"));
        account.withdraw(new BigDecimal("50.00"));

        System.out.println("Checking account:");
        System.out.println("Account number: " + account.getAccountNumber());
        System.out.println("Balance: " + account.getBalance());

        /*
         * INHERITANCE:
         *
         * SavingsAccount is a BankAccount with additional withdrawal rules.
         * It inherits the general account behavior and specializes withdrawal.
         */
        savings.deposit(new BigDecimal("100.00"));
        savings.withdraw(new BigDecimal("300.00"));

        System.out.println("\nSavings account:");
        System.out.println("Balance: " + savings.getBalance());

        /*
         * POLYMORPHISM:
         *
         * A BankAccount reference can refer to a SavingsAccount object.
         * The overridden withdrawal method in SavingsAccount executes.
         */
        BankAccount polymorphicAccount = savings;
        polymorphicAccount.withdraw(new BigDecimal("100.00"));

        System.out.println("Balance after polymorphic withdrawal: " + polymorphicAccount.getBalance());

        /*
         * ABSTRACTION AND COMPOSITION:
         *
         * BankAccount depends on TransactionFeePolicy, not on the concrete
         * FixedTransactionFee implementation.
         *
         * A different policy can be supplied without changing BankAccount.
         */
        TransactionFeePolicy percentageFee = new PercentageTransactionFee(new BigDecimal("0.01"));

        BankAccount anotherAccount = new CheckingAccount("ACC-3001", new BigDecimal("500.00"), percentageFee);

        anotherAccount.withdraw(new BigDecimal("100.00"));

        System.out.println("\nAccount with percentage fee:");
        System.out.println("Balance: " + anotherAccount.getBalance());

        /*
         * INVARIANT ENFORCEMENT:
         *
         * The following operation fails because the withdrawal would make
         * the account balance negative. The account remains valid.
         */
        try {
            account.withdraw(new BigDecimal("10000.00"));
        } catch (IllegalArgumentException e) {
            System.out.println("\nWithdrawal rejected: " + e.getMessage());
        }

        System.out.println("Balance remains: " + account.getBalance());

        /*
         * STATE TRANSITIONS:
         *
         * Closing an account is an explicit domain operation. Once closed,
         * operations that modify its balance are rejected.
         */
        account.close();

        try {
            account.deposit(new BigDecimal("10.00"));
        } catch (IllegalStateException e) {
            System.out.println("Deposit rejected: " + e.getMessage());
        }
    }

    // ABSTRACTION: contract for calculating transaction fees.
    interface TransactionFeePolicy {

        BigDecimal calculateFee(BigDecimal transactionAmount);
    }

    // CONCRETE IMPLEMENTATION: charges a fixed fee per transaction.
    static final class FixedTransactionFee implements TransactionFeePolicy {

        private final BigDecimal fee;

        FixedTransactionFee(BigDecimal fee) {
            Objects.requireNonNull(fee, "Fee cannot be null.");

            if (fee.signum() < 0) {
                throw new IllegalArgumentException("Fee cannot be negative.");
            }

            this.fee = fee;
        }

        @Override
        public BigDecimal calculateFee(BigDecimal transactionAmount) {
            return fee;
        }
    }

    // CONCRETE IMPLEMENTATION: charges a percentage of the transaction amount.
    static final class PercentageTransactionFee implements TransactionFeePolicy {

        private final BigDecimal rate;

        PercentageTransactionFee(BigDecimal rate) {
            Objects.requireNonNull(rate, "Rate cannot be null.");

            if (rate.signum() < 0 || rate.compareTo(BigDecimal.ONE) > 0) {
                throw new IllegalArgumentException("Rate must be between zero and one.");
            }

            this.rate = rate;
        }

        @Override
        public BigDecimal calculateFee(BigDecimal transactionAmount) {
            return transactionAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
        }
    }

    /*
     * ABSTRACTION AND ENCAPSULATION
     *
     * BankAccount represents the general concept of a bank account.
     *
     * Its internal state is private. Public methods expose domain operations
     * rather than allowing arbitrary modification of fields.
     *
     * INVARIANTS:
     * - accountNumber is non-null, non-blank, and immutable.
     * - balance is never negative.
     * - feePolicy is non-null and immutable.
     * - a closed account cannot be used for deposits or withdrawals.
     *
     * The constructor establishes the initial valid state.
     * Every state-changing operation must preserve these conditions.
     */
    static abstract class BankAccount {

        private final String accountNumber;
        private final TransactionFeePolicy feePolicy;
        private BigDecimal balance;
        private boolean closed;

        protected BankAccount(String accountNumber, BigDecimal initialBalance, TransactionFeePolicy feePolicy) {
            if (accountNumber == null || accountNumber.isBlank()) {
                throw new IllegalArgumentException("Account number cannot be blank.");
            }

            Objects.requireNonNull(initialBalance, "Initial balance cannot be null.");

            if (initialBalance.signum() < 0) {
                throw new IllegalArgumentException("Initial balance cannot be negative.");
            }

            this.accountNumber = accountNumber;
            this.balance = initialBalance.setScale(2, RoundingMode.UNNECESSARY);
            this.feePolicy = Objects.requireNonNull(feePolicy, "Fee policy cannot be null.");
            this.closed = false;
        }

        protected static void validatePositiveAmount(BigDecimal amount) {
            Objects.requireNonNull(amount, "Amount cannot be null.");

            if (amount.signum() <= 0) {
                throw new IllegalArgumentException("Amount must be positive.");
            }

            if (amount.scale() > 2) {
                throw new IllegalArgumentException("Amount cannot have more than two decimal places.");
            }
        }

        private static void validateFee(BigDecimal fee) {
            Objects.requireNonNull(fee, "Calculated fee cannot be null.");

            if (fee.signum() < 0 || fee.scale() > 2) {
                throw new IllegalArgumentException("Calculated fee must be non-negative and have at most " + "two decimal places.");
            }
        }

        /*
         * Read-only observation is appropriate here:
         * callers need the account number, but must not change it.
         */
        public final String getAccountNumber() {
            return accountNumber;
        }

        /*
         * This getter exposes a value, not a mutable reference to the
         * account's internal state. BigDecimal is immutable.
         */
        public final BigDecimal getBalance() {
            return balance;
        }

        public final boolean isClosed() {
            return closed;
        }

        /*
         * A domain operation, not a generic setter.
         *
         * Validation occurs before the state changes, preserving the
         * invariant that the balance cannot become negative.
         */
        public final void deposit(BigDecimal amount) {
            ensureOpen();
            validatePositiveAmount(amount);

            BigDecimal newBalance = balance.add(amount);
            balance = newBalance.setScale(2, RoundingMode.UNNECESSARY);
        }

        /*
         * Subclasses may specialize withdrawal rules.
         * The base implementation enforces general account rules.
         */
        public void withdraw(BigDecimal amount) {
            ensureOpen();
            validatePositiveAmount(amount);

            BigDecimal fee = feePolicy.calculateFee(amount);
            validateFee(fee);

            BigDecimal total = amount.add(fee);

            if (total.compareTo(balance) > 0) {
                throw new IllegalArgumentException("Insufficient funds, including transaction fee.");
            }

            BigDecimal newBalance = balance.subtract(total).setScale(2, RoundingMode.UNNECESSARY);

            // Commit the state change only after all checks succeed.
            balance = newBalance;
        }

        /*
         * Explicit domain operation.
         * There is no setClosed(boolean) method because callers should not
         * be able to arbitrarily reopen or close an account.
         */
        public final void close() {
            ensureOpen();

            if (balance.signum() != 0) {
                throw new IllegalStateException("An account must have a zero balance before closing.");
            }

            closed = true;
        }

        protected final BigDecimal calculateFee(BigDecimal amount) {
            BigDecimal fee = feePolicy.calculateFee(amount);
            validateFee(fee);
            return fee;
        }

        protected final void ensureOpen() {
            if (closed) {
                throw new IllegalStateException("Account is closed.");
            }
        }
    }

    /*
     * INHERITANCE AND METHOD OVERRIDING
     *
     * A checking account uses the general BankAccount behavior without
     * adding a special withdrawal rule.
     */
    static final class CheckingAccount extends BankAccount {

        CheckingAccount(String accountNumber, BigDecimal initialBalance, TransactionFeePolicy feePolicy) {
            super(accountNumber, initialBalance, feePolicy);
        }
    }

    /*
     * INHERITANCE, POLYMORPHISM, AND INVARIANTS
     *
     * A savings account must preserve a minimum balance.
     *
     * The overridden withdraw() method enforces this additional invariant
     * before delegating to the superclass's general withdrawal logic.
     */
    static final class SavingsAccount extends BankAccount {

        private final BigDecimal minimumBalance;

        SavingsAccount(String accountNumber, BigDecimal initialBalance, TransactionFeePolicy feePolicy, BigDecimal minimumBalance) {
            super(accountNumber, initialBalance, feePolicy);

            Objects.requireNonNull(minimumBalance, "Minimum balance cannot be null.");

            if (minimumBalance.signum() < 0) {
                throw new IllegalArgumentException("Minimum balance cannot be negative.");
            }

            if (minimumBalance.scale() > 2) {
                throw new IllegalArgumentException("Minimum balance cannot have more than two decimal places.");
            }

            if (minimumBalance.compareTo(initialBalance) > 0) {
                throw new IllegalArgumentException("Minimum balance cannot exceed the initial balance.");
            }

            this.minimumBalance = minimumBalance;
        }

        @Override
        public void withdraw(BigDecimal amount) {
            ensureOpen();
            validatePositiveAmount(amount);

            BigDecimal fee = calculateFee(amount);
            BigDecimal remainingBalance = getBalance().subtract(amount).subtract(fee);

            if (remainingBalance.compareTo(minimumBalance) < 0) {
                throw new IllegalArgumentException("Withdrawal would violate the minimum balance.");
            }

            // The superclass still enforces the general account invariants.
            super.withdraw(amount);
        }
    }
}