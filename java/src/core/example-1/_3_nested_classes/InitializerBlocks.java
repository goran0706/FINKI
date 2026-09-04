package lessons._3_nested_classes;

public class InitializerBlocks {

    int number;
    static int count;

    {
        number = 10;
    }

    static {
        count = 20;
    }

    public static void main(String[] args) {

    }
}

