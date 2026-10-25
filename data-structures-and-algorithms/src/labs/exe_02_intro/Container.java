package labs.exe_02_intro;

import java.text.DecimalFormat;
import java.util.ArrayList;

public class Container<T extends Product> {
    private final String name;
    private final int capacity;
    private final ArrayList<T> products;

    public Container(String name, int capacity) {
        this.name = name;
        this.capacity = capacity;
        this.products = new ArrayList<>(capacity);
    }

    public boolean add(T item) {
        if (products.size() == capacity) {
            return false;
        }

        products.add(item);
        return true;
    }

    public int size() {
        return products.size();
    }

    public double totalValue() {
        double total = 0;

        for (T product : products) {
            total += product.finalPrice();
        }

        return total;
    }

    public T mostExpensive() {
        if (products.isEmpty()) {
            return null;
        }

        // Notes for labs/exams
        // USE OLD JAVA - getFirst not support in this version w/ef it is
        // Prefer JAVA SE 8 APIs

        T highest = products.get(0);
        // T highest = products.getFirst();

        for (T product : products) {
            if (product.finalPrice() > highest.finalPrice()) {
                highest = product;
            }
        }

        return highest;
    }

    public Pair<String, Double> summary() {
        return new Pair<>(name, totalValue());
    }

    public void print() {
        System.out.println("=== " + name + " (" + size() + "/" + capacity + ") ===");

        for (T product : products) {
            System.out.println(product);
        }

        DecimalFormat formatter = new DecimalFormat("0.00");
        System.out.println("Total: " + formatter.format(totalValue()));

        T highest = mostExpensive();

        if (highest == null) {
            System.out.println("Most expensive: none");
        } else {
            System.out.println("Most expensive: " + highest.getName() + " (" + formatter.format(highest.finalPrice()) + ")");
        }
    }
}



