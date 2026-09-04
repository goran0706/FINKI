public class _13_Strings {
    public static void main(String[] args) {
        // String class:
        // - Has some awesome methods
        // - String objects are immutable (cannot be modified)
        String greeting = "Hello";
        String name = "John";
        System.out.println(greeting + " " + name);

        // StringBuilder class:
        // - Is the mutable counterpart to String
        // - In other words, objects of StringBuilder can be modified
        StringBuilder sb = new StringBuilder();
        sb.append("Hello");
        sb.append(" ");
        sb.append("John");
        sb.replace(sb.indexOf("John"), sb.length(), "Jane");
        System.out.println(sb);

        // Permutations:
        // A permutation is an arrangement of all or part of a set of objects, with regard to the order of the arrangement.
        // For instance, the words ‘bat’ and ‘tab’ represent two distinct permutations (or arrangements) of a similar three-letter word.

        // Escape sequence
        var escaped = "Hello \t World";
        System.out.println(escaped);
    }
}
