package _01_fundamentals;

public class _25_Static {

    /*
     * The static keyword associates a member with the class itself,
     * rather than with individual instances.
     *
     * Static members include:
     * - Static fields
     * - Static initialization blocks
     * - Static methods
     *
     * Static imports allow static members to be used without qualifying
     * them with their declaring class name.
     */

    // Static field: shared by all instances of this class.
    static int count = 10;

    // Static initialization block: runs once when the class is initialized.
    static {
        count = 20;
    }

    // Static method: can be called without creating an instance.
    static int getCount() {
        return count;
    }

    static void printCount() {
        System.out.println(_25_Static.getCount());
    }

    static void main(String[] args) {

        // Access a static field through the class name.
        System.out.println(_25_Static.count);

        // Call a static method through the class name.
        System.out.println(_25_Static.getCount());

        // Calling a static method from the same class.
        printCount();
    }
}