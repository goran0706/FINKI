package labs.exe_02_intro;

import java.text.DecimalFormat;

public class Product {
    private String name;
    private double price;

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double finalPrice() {
        return price;
    }

    @Override
    public String toString() {
        DecimalFormat formatter = new DecimalFormat("0.00");
        return name + " price=" + formatter.format(price) + " final=" + formatter.format(finalPrice());
    }
}
