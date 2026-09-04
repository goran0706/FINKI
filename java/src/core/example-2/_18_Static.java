public class _18_Static {
    static int count = 10; // static variable

    static {
        count = 20; // static initialization block
    }

    static int getCount() { // static method
        return count;
    }

    public static void main(String[] args) {
        System.out.println(getCount());
    }
}
