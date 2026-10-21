package _07_records;

public class _18_RecordLimitations {

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice");
        System.out.println(employee);

        Product product = new Product("Keyboard", 50.00);

        System.out.println(product.name());
        System.out.println(product.price());
        System.out.println(product.priceWithTax(0.18));
        System.out.println(Product.CURRENCY);

        // Compilation error: records cannot be subclassed.
        // class Manager extends Employee { }
    }

    // Records are implicitly final, so they cannot be extended.
    record Employee(String id, String name) {
    }

    // Records cannot declare additional instance fields beyond their components.
    // Static fields are allowed.
    record Product(String name, double price) {

        static final String CURRENCY = "EUR";

        // Compilation error: an additional instance field is not allowed.
        // private String category;

        public double priceWithTax(double taxRate) {
            return price * (1 + taxRate);
        }
    }
}