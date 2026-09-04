public class _10_SelectionControlStatements {
    public static void main(String[] args) {
        // Selection Control Statements
        // 1) The if statement
        // 2) The if-else statement
        // 3) The switch statement

        int age = 18;

        if (age > 18) {
            System.out.println("You can drive!");
        }

        if (age > 18) {
            System.out.println("You can drive!");
        } else {
            System.out.println("You cannot drive yet!");
        }

        switch (age) {
            case 18:
                System.out.println("You can drive!");
                break;
            case 19:
            case 20:
            case 21:
                System.out.println("You can drive!");
                break;
            default:
                System.out.println("You cannot drive yet!");
        }

        switch (age) {
            case 18 -> System.out.println("You can drive!");
            case 19, 20, 21 -> System.out.println("You can drive!");
            default -> System.out.println("You cannot drive yet!");
        }
    }
}
