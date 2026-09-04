package exercises;

import java.util.Random;

public class RandomNumberGenerator {
    public static void main(String[] args) {
        // Pseudo-random number generators (PRNGs)
        // - Produce sufficiently random values for our purposes
        Random random = new Random();

        int randomNumber1 = random.nextInt(100); // inclusive 0-99
        double randomNumber2 = random.nextDouble(100) + 1; // shifting right 1-100

        System.out.println(randomNumber1);
        System.out.println(randomNumber2);
    }
}
