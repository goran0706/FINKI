public class _11_RepetitionControlStatements {
    public static void main(String[] args) {
        // Repetition Control Statements
        // The while loop
        // The do-while loop
        // The for loop

        int count = 0;

        while (count < 10) {
            System.out.println(count);
            count++;
        }

        // Guaranteed to run at least once.
        // Post loop continuation condition.
        do {
            System.out.println(count);
            count++;
        } while (count < 10);

        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
    }
}
