package exercises;

public class CountDown {
    public static void main(String[] args) {
        countDown(10);
    }

    private static void countDown(int n) {
        if (n < 0) return;

        System.out.println(n);
        countDown(n - 1);
    }
}
