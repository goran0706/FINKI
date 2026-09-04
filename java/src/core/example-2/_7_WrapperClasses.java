public class _7_WrapperClasses {
    public static void main(String[] args) {
        // Wrapper Classes
        // - Byte, Short, Integer, Long
        // - Float, Double
        // - Boolean
        // - Character

        // Converting Primitive and Reference Types
        String strPI = "3.14159";
        double numPI = Double.parseDouble(strPI); // Unboxing
        String backToString = String.valueOf(numPI); // Boxing

        int x = 10;
        Integer x1 = Integer.valueOf(x);
        Integer x2 = Integer.valueOf(10);

        // Integer caching
        // Integer objects with values in range between -128 to +127 are cached and reused,
        // hence preventing creating of a new object instance each time a new Integer within that range is created.
        Integer x3 = 120;
        Integer x4 = 120;
        System.out.println(x3 == x4); // true


        boolean bp = true;
        Boolean bw = Boolean.valueOf(bp);

        boolean unbp = true;
    }
}
