package lessons;

public class _9_Casting {
    public static void main(String[] args) {

        // Casting:

        // int >>> double
        // Changing from the one type to the other happens automatically when you want to convert smaller to larger.

        // double >>> int
        // Changing from a larger type to a smaller, you have to do that explicitly.

        // Double can hold a more precise number than int. If you want to change a double value to an int, you have to
        // make an explicit cast, to indicate that you aare really sure about this.

        int i = 3;
        double d = i; // Promotion
        int j = (int) d; // Casting

        byte b = 10;
        short s = b;
        int x = s;
        long l = x;

        x = (int) l;
        s = (short) x;
        b = (byte) s;

        double dec = 10.50;
        int num = (int) dec;
        dec = num;
    }
}
