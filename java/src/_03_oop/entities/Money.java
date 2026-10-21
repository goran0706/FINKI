package _03_oop.entities;

import java.math.BigDecimal;

public record Money(BigDecimal amount, String currency) {

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currencies must match.");
        }

        return new Money(amount.add(other.amount), currency);
    }

    public Money subtract(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currencies must match.");
        }

        return new Money(amount.subtract(other.amount), currency);
    }

    @Override
    public String toString() {
        return currency + " " + amount;
    }
}