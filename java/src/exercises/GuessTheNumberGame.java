package exercises;

import java.util.Random;
import java.util.Scanner;

public class GuessTheNumberGame {
    public static void main(String[] args) {
        Random random = new Random();
        Scanner keyboard = new Scanner(System.in);

        int computerNumber = random.nextInt(100);
        int playerNumber;
        int guessesLeft = 10;
        boolean guessedNumber = false;

        while (!guessedNumber) {
            if (guessesLeft == 0) {
                System.out.println("Game Over");
                break;
            }

            System.out.println("Guess the number");
            playerNumber = keyboard.nextInt();

            if (playerNumber >= 0 && playerNumber <= 100) {
                if (playerNumber == computerNumber) {
                    guessedNumber = true;
                    System.out.println("Correct!!!");
                } else if (playerNumber < computerNumber) {
                    guessesLeft--;
                    System.out.println("Try with a greater number");
                } else {
                    guessesLeft--;
                    System.out.println("Try with a smaller number");
                }
            } else {
                System.out.println("Invalid number range");
            }
        }
    }
}
