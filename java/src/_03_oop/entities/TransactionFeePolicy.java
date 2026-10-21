package _03_oop.entities;

public class TransactionFeePolicy {

    private Money fee;

    public TransactionFeePolicy(Money fee) {
        this.fee = fee;
    }

    public Money calculateFee() {
        return fee;
    }

    public Money getFee() {
        return fee;
    }

    public void setFee(Money fee) {
        this.fee = fee;
    }
}