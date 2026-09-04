package lessons._1_oop;

import java.util.Date;
import java.util.Objects;

public class CreditCard {
    public final int VISA = 5001;
    public String accountName;
    public String cardNumber;
    public Date expDate;

    public CreditCard(String accountName, String cardNumber, Date expDate) {
        this.accountName = accountName;
        this.cardNumber = cardNumber;
        this.expDate = expDate;
    }

    public int getVISA() {
        return VISA;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public Date getExpDate() {
        return expDate;
    }

    public void setExpDate(Date expDate) {
        this.expDate = expDate;
    }

    @Override
    public String toString() {
        return "CreditCard{" +
                "VISA=" + VISA +
                ", accountName='" + accountName + '\'' +
                ", cardNumber='" + cardNumber + '\'' +
                ", expDate=" + expDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CreditCard that)) return false;
        return VISA == that.VISA && accountName.equals(that.accountName) && cardNumber.equals(that.cardNumber) && expDate.equals(that.expDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(VISA, accountName, cardNumber, expDate);
    }
}
