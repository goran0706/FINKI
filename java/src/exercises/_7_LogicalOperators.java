public class _7_LogicalOperators {
    public static void main(String[] args) {
        // Logical operators used for combining Boolean value. We use the logical tables.

        boolean isRaining = true;
        boolean isWarm = false;

        boolean combined = isRaining && isWarm;
        System.out.println(combined);

        combined = isRaining || isWarm;
        System.out.println(combined);
    }
}
