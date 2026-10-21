package _01_fundamentals;

public class _27_InitializationBlocks {

    /*
     * Java has two types of initialization blocks:
     *
     * 1. Static initialization block:
     *    - Declared using the static keyword.
     *    - Executes once when the class is initialized.
     *    - Executes in source-code order alongside static field initializers.
     *    - Used to initialize static fields or perform class-level setup.
     *
     * 2. Instance initialization block:
     *    - Declared without the static keyword.
     *    - Executes every time an instance is created.
     *    - Executes after the superclass constructor and before the current
     *      class's constructor body.
     *    - Runs in source-code order alongside instance field initializers.
     *
     * Initialization order:
     *
     * Class initialization:
     *    1. Static field initializers and static blocks, in source-code order.
     *
     * Object initialization:
     *    1. The superclass is initialized if necessary.
     *    2. The superclass constructor executes, including its initialization.
     *    3. Instance field initializers and instance blocks execute in
     *       source-code order for the current class.
     *    4. The current class's constructor body executes.
     */

    // Static field initializer.
    static int staticCounter = initializeStaticCounter();

    // Static initialization block.
    static {
        System.out.println("Static initialization block");
        staticCounter++;
    }

    // Instance field initializer.
    int instanceCounter = initializeInstanceCounter();

    // Instance initialization block.
    {
        System.out.println("Instance initialization block");
        instanceCounter++;
    }

    public _27_InitializationBlocks() {
        System.out.println("Constructor");
        instanceCounter++;
    }

    private static int initializeStaticCounter() {
        System.out.println("Static field initializer");
        return 1;
    }

    static void main(String[] args) {
        // Static initialization occurs once before main executes.
        System.out.println("Static counter: " + staticCounter);

        System.out.println("\nCreating the first object:");
        _27_InitializationBlocks first = new _27_InitializationBlocks();
        System.out.println("Instance counter: " + first.instanceCounter);

        System.out.println("\nCreating the second object:");
        _27_InitializationBlocks second = new _27_InitializationBlocks();
        System.out.println("Instance counter: " + second.instanceCounter);

        System.out.println("\nFinal static counter: " + staticCounter);
    }

    private int initializeInstanceCounter() {
        System.out.println("Instance field initializer");
        return 1;
    }
}