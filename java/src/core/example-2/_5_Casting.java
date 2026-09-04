public class _5_Casting {
    public static void main(String[] args) {
        /*
         * Casting:
         *
         * Changing from one type to the other happens automatically when you want to convert a smaller type to larger.
         * Changing from a larger type to a smaller, you have to do that explicitly, to let Java know about the intention.
         *
         * Examples:
         * int >>> double
         * double >>> int
         * Double can hold a more precise number than int. If you want to change a double value to an int,
         * you have to make an explicit cast to indicate that you are really sure about this.
         *
         * */

        // Type Casting (narrowing and widening)
        double myDouble = 3.14;
        float myFloat;
        double yourDouble;
        myFloat = (float) myDouble; // narrowing/lossy conversion
        yourDouble = myFloat; // widening/lossless conversion

        short num1 = 10;
        int num2 = 10;
        long num3 = 10L;
        num2 = num1; // Promotion
        num1 = (short) num2; // Casting
    }
}
