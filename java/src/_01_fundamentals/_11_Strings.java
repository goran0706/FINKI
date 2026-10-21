package _01_fundamentals;

public class _11_Strings {

    static void main(String[] args) {

        /*
         * String
         *
         * String represents a sequence of characters.
         *
         * String objects are immutable: once created, their contents
         * cannot be changed. Operations that appear to modify a String
         * return a new String instead.
         */


        // 1. Creating and Concatenating Strings

        String greeting = "Hello";
        String name = "John";

        String message = greeting + " " + name;

        System.out.println(message);

        // String concatenation using the + operator creates a new String.
        greeting = greeting + " there";

        System.out.println(greeting);


        // 2. Common String Methods

        String text = "  Java Programming  ";

        System.out.println("\nOriginal: \"" + text + "\"");
        System.out.println("Length: " + text.length());
        System.out.println("Trimmed: \"" + text.trim() + "\"");
        System.out.println("Uppercase: " + text.toUpperCase());
        System.out.println("Lowercase: " + text.toLowerCase());
        System.out.println("Contains Java: " + text.contains("Java"));
        System.out.println("Starts with spaces: " + text.startsWith("  "));
        System.out.println("Character at index 2: " + text.charAt(2));
        System.out.println("Substring: " + text.substring(2, 6));
        System.out.println("Replace: " + text.replace("Java", "Kotlin"));


        // 3. Comparing Strings

        String first = "Java";
        String second = "Java";
        String third = "Java";

        // Use equals() to compare String contents.
        System.out.println("\nfirst equals second: " + first.equals(second));
        System.out.println("first equals third: " + first.equals(third));

        // == compares object references, not String contents.
        System.out.println("first == second: " + (first == second));
        System.out.println("first == third: " + (first == third));

        // equalsIgnoreCase() ignores differences in letter case.
        System.out.println("Case-insensitive comparison: " + first.equalsIgnoreCase("JAVA"));


        // 4. Escape Sequences

        // Common escape sequences:
        // \n  - new line
        // \t  - tab
        // \"  - double quote
        // \'  - single quote
        // \\  - backslash

        String escaped = "Hello\tWorld\n\"Java\" programming\nPath: C:\\Java";
        System.out.println("\n" + escaped);


        // 5. StringBuilder

        /*
         * StringBuilder represents a mutable sequence of characters.
         * Its contents can be modified without creating a new String
         * for every operation.
         *
         * It is useful when repeatedly building or modifying text.
         */

        StringBuilder builder = new StringBuilder();

        builder.append("Hello");
        builder.append(" ");
        builder.append("John");

        System.out.println("\nStringBuilder: " + builder);

        // Replace the text "John" with "Jane".
        int start = builder.indexOf("John");

        if (start != -1) {
            builder.replace(start, start + "John".length(), "Jane");
        }

        System.out.println("After replacement: " + builder);


        // 6. Additional StringBuilder Operations

        builder.insert(5, ",");
        System.out.println("After insertion: " + builder);

        builder.deleteCharAt(5);
        System.out.println("After deleting character: " + builder);

        builder.reverse();
        System.out.println("Reversed: " + builder);

        // Convert StringBuilder to an immutable String.
        String finalText = builder.toString();

        System.out.println("As String: " + finalText);


        // 7. Building Strings in a Loop

        StringBuilder numbers = new StringBuilder();

        for (int i = 1; i <= 5; i++) {
            if (i > 1) {
                numbers.append(", ");
            }

            numbers.append(i);
        }

        System.out.println("\nNumbers: " + numbers);


        /*
         * String Permutations
         *
         * A permutation is an arrangement of characters in a different order.
         *
         * For example, the distinct permutations of "ABC" are:
         * ABC, ACB, BAC, BCA, CAB, CBA.
         *
         * Generating permutations is a common recursion and backtracking
         * exercise.
         */
    }
}