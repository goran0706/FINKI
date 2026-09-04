public class _17_String {
    public static void main(String[] args) {
        // String objects are immutable (cannot be modified)
        // StringBuilder is the mutable counterpart to String (can be modified)

        String name = "John Doe";
        String name2 = "Jane Doe";

        for (int i = 0; i < name.length(); i++) {
            System.out.println(name.charAt(i));
        }

        System.out.println();

        for (int i = 0; i < name2.length(); i++) {
            System.out.println(name2.charAt(i));
        }

        if (name.equals(name2)) {
            System.out.println("Names are equal.");
        } else {
            System.out.println("Names are not equal.");
        }

        if (name.compareTo(name2) > 0) {
            System.out.println("name > name2");
        } else {
            System.out.println("name <= name2");
        }
    }
}
