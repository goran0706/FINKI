import java.util.ArrayList;

public class _15_ArrayLists {
    public static void main(String[] args) {
        // Unlike arrays, which have fixed size, ArrayLists can resize.
        // ArrayLists live in the java.util package. ArrayLists hold only reference types.

        ArrayList<String> namesList = new ArrayList<>();
        namesList.add("Kyle");
        namesList.add("Sarah");
        namesList.add("John");

        System.out.println(namesList);

        for (String name : namesList) {
            System.out.println(name);
        }
    }
}
