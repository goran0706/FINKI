public class _3_Conversion {
    public static void main(String[] args) {
        double myDouble = 10.50;
        float myFloat = (float) myDouble; // narrowing/ lossy conversion
        double yourDouble = myFloat; // widening/lossless conversion
    }
}
