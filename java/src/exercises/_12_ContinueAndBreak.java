public class _12_ContinueAndBreak {
    public static void main(String[] args) {
        int count = 0;

        while (count < 10) {
            if (count == 5) {
                System.out.println("Count is 5. skipping 5...");
                count++;
                continue;
            }

            if (count == 7) {
                System.out.println("Count is 7. exiting...");
                break;
            }

            count++;
        }
    }
}
