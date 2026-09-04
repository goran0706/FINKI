import java.util.Scanner;

public class _8_UserInput {
    public static void main(String[] args) {
        // User Input:
        // 1) System.out provides for standard output
        // 2) System.in provides for standard input

        Scanner keyboard = new Scanner(System.in);

        System.out.println("What is your name?");
        String name = keyboard.nextLine();

        System.out.println("What is your age?");
        String age = keyboard.nextLine();

        System.out.println("What city do you live?");
        String city = keyboard.nextLine();

        System.out.println("Hello, " + name);
        System.out.println("age is " + age);
        System.out.println("city is " + city);
    }
}
