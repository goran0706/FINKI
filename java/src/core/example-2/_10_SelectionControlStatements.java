public class _10_SelectionControlStatements {
    public static void main(String[] args) {
        //Selection Control Statements
        // - The if statement
        // - The if-else statement
        // - The switch statement

        int age = 17;

        //The if statement
        if (age > 20) {
            System.out.println("an adult");
        }

        //The if-else statement
        if (age > 20) {
            System.out.println("an adult");
        } else {
            System.out.println("a minor");
        }

        if (age > 20) {
            System.out.println("an adult");
        } else if (age > 17 && age < 20) {
            System.out.println("adolescent");
        } else {
            System.out.println("a minor");
        }

        //enhanced switch statement
        switch (age) {
            case 20 -> System.out.println("an adult");
            case 17 -> System.out.println("adolescent");
            default -> System.out.println("a minor");
        }
    }
}
