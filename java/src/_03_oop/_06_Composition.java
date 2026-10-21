package _03_oop;

import _03_oop.entities.FixedTransactionFee;
import _03_oop.entities.Money;
import _03_oop.entities.TransactionFeePolicy;

import java.math.BigDecimal;

public class _06_Composition {

    static void main(String[] args) {
        Money fee = new Money(new BigDecimal("5.00"), "EUR");

        // Composition means a class contains or uses an object of another class
        // to provide some of its functionality.
        //
        // Here, TransactionFeePolicy has a Money object representing its fee.
        // The policy uses that object rather than storing the amount as a primitive.
        TransactionFeePolicy feePolicy = new FixedTransactionFee(fee);

        System.out.println("Transaction Fee: " + feePolicy.calculateFee());
    }
}