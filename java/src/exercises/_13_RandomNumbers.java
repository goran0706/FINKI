import java.util.Random;

public class _13_RandomNumbers {
    public static void main(String[] args) {
        // Pseudo-random number generators (PRNGs)
        // 1) Produce sufficiently random values for our purpose

        Random random = new Random();

        int myRandomNumber = random.nextInt();
        System.out.println(myRandomNumber);

        // shifting
        myRandomNumber = random.nextInt(1000) + 1;
        System.out.println(myRandomNumber);
    }
}
