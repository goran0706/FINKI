import java.util.Arrays;

public class _14_Arrays {
    public static void main(String[] args) {
        // Data Structures - collections of elements
        // Arrays are data structures of homogeneous elements

        int[] myNumbers = new int[5];
        myNumbers[0] = 0;
        myNumbers[1] = 1;
        myNumbers[2] = 2;
        myNumbers[3] = 3;
        myNumbers[4] = 4;

        System.out.println(Arrays.toString(myNumbers));

        for (int i = 0; i < myNumbers.length; i++) {
            System.out.println(i);
        }

        for (int num : myNumbers) {
            System.out.println(num);
        }
    }
}
