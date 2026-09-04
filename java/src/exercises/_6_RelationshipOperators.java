public class _6_RelationshipOperators {
    public static void main(String[] args) {
        // Relationship operators used for comparing values and returning a Boolean result (true or false).
        // >
        // >=
        // <
        // <=
        // ==
        // !=

        boolean myBool = true;
        boolean yourBool = false;
        int myAge = 33;
        int yourAge = 20;
        int johnAge = 20;

        String myName = "John";
        String yourName = "Jane";

        //relational operations
        boolean ageComparison = myAge > yourAge;
        System.out.println(ageComparison);

        ageComparison = myAge > johnAge;
        System.out.println(ageComparison);

        ageComparison = yourAge > johnAge;
        System.out.println(ageComparison);

    }
}
