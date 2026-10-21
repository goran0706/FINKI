package _03_oop.entities;

import java.math.BigDecimal;

public class PercentageTransactionFee extends TransactionFeePolicy {

    private BigDecimal percentage;

    public PercentageTransactionFee(Money fee, BigDecimal percentage) {
        super(fee);
        this.percentage = percentage;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public Money calculateFee(Money transactionAmount) {
        BigDecimal feeAmount = transactionAmount.amount()
                .multiply(percentage)
                .divide(BigDecimal.valueOf(100));

        return new Money(feeAmount, transactionAmount.currency());
    }
}