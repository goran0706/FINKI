package lessons;

public class _12_Strings {
    public static void main(String[] args) {
        // String class:
        // - Has some awesome methods
        // - String objects are immutable (cannot be modified)

        // String
        String greeting = "Hello ";
        String name = "John";
        System.out.println(greeting + name);

        // StringBuilder class:
        // - Is the mutable counterpart to String
        // - In other words, objects of StringBuilder can be modified

        // StringBuilder
        StringBuilder sb = new StringBuilder();
        sb.append("Hello");
        sb.append(" ");
        sb.append("John");
        sb.replace(sb.indexOf("John"), sb.length(), "Jane");
        System.out.println(sb);

        // Permutations:
        // Given a string str, the task is to print all the permutations of str.
        // A permutation is an arrangement of all or part of a set of objects, with regard to the order of the arrangement.
        // For instance, the words ‘bat’ and ‘tab’ represents two distinct permutation (or arrangements) of a similar three-letter word.
    }
}
