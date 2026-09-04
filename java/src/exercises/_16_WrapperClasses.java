import java.util.ArrayList;

public class _16_WrapperClasses {
    public static void main(String[] args) {
        // ArrayLists are a type of entity known as a generic
        // Generics (including ArrayLists) can only work with reference types
        // Wrapper classes exists to represent their primitive types.

        // Wrapper classes:
        // Byte, Short, Integer, Long
        // Float, Double
        // Character, Boolean

        ArrayList<Integer> myNumbers = new ArrayList<>();
        myNumbers.add(1);
        myNumbers.add(2);
        myNumbers.add(3);
        myNumbers.add(4);
        myNumbers.add(5);

        System.out.println(myNumbers);

        String stringNumber = "450";
        int result = Integer.parseInt(stringNumber + 100);
        System.out.println(result);
    }
}
