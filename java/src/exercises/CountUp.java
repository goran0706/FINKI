package exercises;

public class CountUp {
    public static void main(String[] args) {
        countUp(0, 10);
    }

    private static void countUp(int from, int to) {
        if (from > to) return;

        System.out.println(from);
        countUp(from + 1, to);
    }
}
