package lessons;

// Static import

public class _15_Static {

    // static variable
    static int number = 10;

    // static initializer
    static {
        number = 20;
    }

    // static method
    static void printNumber() {
        System.out.println(_15_Static.number);
    }

    public static void main(String[] args) {
        _15_Static.printNumber();
    }
}
