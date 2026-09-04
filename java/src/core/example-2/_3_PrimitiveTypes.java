public class _3_PrimitiveTypes {
    public static void main(String[] args) {
        /*
         * Primitive types:
         * - Hold the value of interest directly
         * - There are 8 Primitive types: byte, short, int, long, float, double, char, boolean
         * */

        // Whole numbers
        byte _byte = 10;
        short _short = 10;
        int _integer = 10;
        long _long = 10L;

        // Decimals, floating points
        float _float = 10.50F;
        double _double = 10.00;

        // Characters
        char _character = 'A';

        // Truthy or False
        boolean _boolean = true;

        //Examples:
        byte nybbles = 0b0010_0101;
        long creditCardNumber = 1234_5678_9012_3456L;
        long socialSecurityNumber = 999_99_9999L;
        long hexBytes = 0xFF_EC_DE_5EL;
        long hexWords = 0xCAFE_BABEL;
        long maxLong = 0x7fff_ffff_ffff_ffffL;
        long bytes = 0b110100010_01101001_100;
    }
}
