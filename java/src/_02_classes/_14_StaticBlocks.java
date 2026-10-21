package _02_classes;

/*
 * A static initializer block runs once when the class is initialized,
 * before its static members are used for the first time.
 *
 * Static initializer blocks execute in source order.
 * Unlike instance initializer blocks, they do not run for every object.
 */
public class _14_StaticBlocks {

    // Static field shared by all objects of this class.
    private static final String applicationName;

    // Static initializer: initializes class-level state.
    static {
        applicationName = "Acme";
        System.out.println("Static initializer: " + applicationName);
    }

    public _14_StaticBlocks() {
        System.out.println("Constructor: object created");
    }

    static void main(String[] args) {
        System.out.println("Main method started");

        new _14_StaticBlocks();
        new _14_StaticBlocks();
    }
}