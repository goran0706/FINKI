package _03_oop;

public class _10_DiamondProblem {

    static void main(String[] args) {
        BankTransfer transfer = new BankTransfer();
        transfer.execute();
    }

    interface Transferable {
        default void execute() {
            System.out.println("Executing transfer.");
        }
    }

    interface Auditable {
        default void execute() {
            System.out.println("Recording audit.");
        }
    }

    static class BankTransfer implements Transferable, Auditable {

        // Both interfaces provide a default implementation of execute().
        // Java cannot choose which implementation to inherit automatically.
        // The class must override execute() to resolve this conflict.

        @Override
        public void execute() {
            Transferable.super.execute();
            Auditable.super.execute();
        }
    }
}