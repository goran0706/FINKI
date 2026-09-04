import java.util.Arrays;

public class _4_ReferenceTypes {
    public static void main(String[] args) {
        /*
         * Reference types:
         * - Hold the memory address of the object of interest e.g. I@4617c264
         * */

        String greeting = "Hello World";
        System.out.println(greeting);

        int[] numbers = new int[3];
        numbers[1] = 1;
        numbers[2] = 2;
        System.out.println(Arrays.toString(numbers));
    }
}
