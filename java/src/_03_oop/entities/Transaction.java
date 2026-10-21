package _03_oop.entities;

import java.time.LocalDateTime;

public class Transaction {

    private final String id;
    private final Type type;
    private final Money amount;
    private final LocalDateTime date;

    public Transaction(String id, Type type, Money amount) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.date = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public Type getType() {
        return type;
    }

    public Money getAmount() {
        return amount;
    }

    public LocalDateTime getDate() {
        return date;
    }

    @Override
    public String toString() {
        return "Transaction ID: " + id
                + ", Type: " + type
                + ", Amount: " + amount
                + ", Date: " + date;
    }

    public enum Type {
        DEPOSIT,
        WITHDRAWAL
    }
}