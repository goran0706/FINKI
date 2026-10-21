package _01_fundamentals;

public class _13_SelectionControlStatements {

    static void main(String[] args) {

        /*
         * Selection Control Statements
         *
         * Selection statements control which block of code executes
         * based on a condition or the value of an expression.
         *
         * - if
         * - if-else
         * - if-else-if
         * - switch statement
         * - switch expression
         */


        // 1. if Statement

        int age = 17;

        if (age >= 18) {
            System.out.println("An adult");
        }


        // 2. if-else Statement

        if (age >= 18) {
            System.out.println("An adult");
        } else {
            System.out.println("A minor");
        }


        // 3. if-else-if Statement

        if (age >= 20) {
            System.out.println("An adult");
        } else if (age >= 18) {
            System.out.println("A young adult");
        } else if (age >= 13) {
            System.out.println("An adolescent");
        } else {
            System.out.println("A child");
        }

        /*
         * Conditions are evaluated from top to bottom.
         * The first matching branch executes, and the remaining branches
         * are skipped.
         */


        // 4. Traditional switch Statement

        int day = 3;

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            default:
                System.out.println("Unknown day");
        }

        /*
         * In a traditional switch statement, break prevents execution
         * from falling through into the next case.
         */


        // 5. Enhanced switch Statement

        // Arrow labels do not fall through into subsequent cases.
        switch (age) {
            case 18 -> System.out.println("An adult");
            case 17 -> System.out.println("An adolescent");
            default -> System.out.println("Another age");
        }


        // 6. switch Expression

        // A switch expression produces a value that can be assigned.
        String ageCategory = switch (age) {
            case 0, 1, 2 -> "Toddler";
            case 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 -> "Child";
            case 13, 14, 15, 16, 17 -> "Adolescent";
            case 18, 19 -> "Young adult";
            default -> age >= 20 ? "Adult" : "Invalid age";
        };

        System.out.println("Age category: " + ageCategory);


        // 7. switch with Multiple Labels

        int month = 4;

        String season = switch (month) {
            case 12, 1, 2 -> "Winter";
            case 3, 4, 5 -> "Spring";
            case 6, 7, 8 -> "Summer";
            case 9, 10, 11 -> "Autumn";
            default -> "Invalid month";
        };

        System.out.println("Season: " + season);
    }
}