package labs.exe_01_intro;

public class Electronics extends Product {
    private int warrantyMonths;

    public Electronics(String name, double price, int warrantyMonths) {
        super(name, price);
        this.warrantyMonths = warrantyMonths;
    }

    public int getWarrantyMonths() {
        return warrantyMonths;
    }

    public void setWarrantyMonths(int warrantyMonths) {
        this.warrantyMonths = warrantyMonths;
    }

    @Override
    public double finalPrice() {
        double price = super.finalPrice();

        if (warrantyMonths > 24) {
            price = price + (price * 15 / 100);
        }

        return price;
    }

    @Override
    public String toString() {
        return super.toString() + " warranty=" + warrantyMonths;
    }
}
