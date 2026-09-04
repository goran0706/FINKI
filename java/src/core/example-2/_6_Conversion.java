public class _6_Conversion {
    public static void main(String[] args) {
        // Converting a String to an integer
        int num = Integer.parseInt("10"); // Unboxing
        System.out.println(num);

        // Converting an integer to a String
        String str = String.valueOf(10); // Boxing
        System.out.println(str);

        // Converting Primitive and Reference Types
        String strPI = "3.14159";
        double numPI = Double.parseDouble(strPI); // Unboxing
        String backToString = String.valueOf(numPI); // Boxing
    }
}
