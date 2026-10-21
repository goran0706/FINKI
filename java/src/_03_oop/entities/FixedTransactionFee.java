package _03_oop.entities;

public class FixedTransactionFee extends TransactionFeePolicy {

    public FixedTransactionFee(Money fee) {
        super(fee);
    }
}