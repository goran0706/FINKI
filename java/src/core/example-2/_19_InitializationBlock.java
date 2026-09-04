public class _19_InitializationBlock {
    static int staticCounter;

    static { // Static Initialization block
        staticCounter = 1;
    }

    int instanceCounter;

    { // Initialization block
        instanceCounter = 2;
    }

    public static void main(String[] args) {
        System.out.println(staticCounter);

        _19_InitializationBlock init = new _19_InitializationBlock();
        System.out.println(init.instanceCounter);
    }
}
