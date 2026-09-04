package lessons;

import java.util.Arrays;

public class _5_PrimitiveVsReferenceTypes {
    public static void main(String[] args) {
        /*
            Primitives types:
            - Hold the value of interest directly
            - There are 8 Primitive Types: byte, short, int, long, float, double, char, boolean
        */
        int someNumber = 10;

        /*
             References types:
             - Hold the memory address of the object of interest
        */
        String someText = "Hello World";
        int[] someNumbers = new int[3];
        someNumbers[0] = 1;
        someNumbers[1] = 2;
        someNumbers[2] = 3;

        System.out.println(someNumbers); // Reference type, points to the following address in memory I@4617c264
        System.out.println(Arrays.toString(someNumbers)); // [1, 2, 3]
    }
}