package lessons;

import java.util.Scanner;

public class _13_UserInput {
    public static void main(String[] args) {
        Scanner keyboard = new Scanner(System.in);

        System.out.println("Enter your age");
        int age = keyboard.nextInt();
        keyboard.nextLine(); // good habit after using a non-string user inputs

        System.out.println("Enter your name");
        String name = keyboard.nextLine();

        System.out.println("Hi " + name + " you are " + age + " years old.");
    }
}
