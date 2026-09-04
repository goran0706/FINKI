import java.util.Scanner;

public class _14_Scanner {
    public static void main(String[] args) {
        Scanner keyboard = new Scanner(System.in);

        System.out.println("Enter your name.");
        String name = keyboard.nextLine();

        System.out.println("Hi " + name + ", please enter your age.");
        int age = keyboard.nextInt();
        keyboard.nextLine(); // good habit after using a non-string user inputs

        System.out.println("Your age is: " + age);
    }
}
