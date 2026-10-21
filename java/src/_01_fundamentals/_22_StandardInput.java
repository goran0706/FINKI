package _01_fundamentals;

import java.util.Scanner;

public class _22_StandardInput {

    static void main(String[] args) {

        /*
         * Standard Input, Output, and Error
         *
         * System.in  - Standard input stream (stdin), typically the keyboard.
         * System.out - Standard output stream (stdout), for normal output.
         * System.err - Standard error stream (stderr), for error messages.
         *
         * Scanner wraps System.in to make reading user input easier.
         *
         * Common Scanner methods:
         * - next(): reads the next token, stopping at whitespace.
         * - nextLine(): reads the remaining characters on the current line.
         * - nextInt(): reads an int.
         * - nextLong(): reads a long.
         * - nextDouble(): reads a double.
         * - nextBoolean(): reads a boolean.
         *
         * Methods such as nextInt() and nextDouble() consume the token,
         * but not the line separator. Calling nextLine() afterward consumes
         * the remaining line, preventing it from being read as empty input.
         */

        try (Scanner keyboard = new Scanner(System.in)) {

            // 1. Reading a Name and Age

            System.out.print("Enter your name: ");
            String name = keyboard.nextLine();

            System.out.print("Enter your age: ");
            int age = keyboard.nextInt();
            keyboard.nextLine();

            System.out.println("Hi " + name + ", you are " + age + " years old.");


            // 2. Reading a Full Name

            System.out.print("\nEnter your full name: ");
            String fullName = keyboard.nextLine();

            System.out.println("Your full name is: " + fullName);


            // 3. Reading a Numeric Value

            System.out.print("\nEnter your height in meters: ");
            double height = keyboard.nextDouble();
            keyboard.nextLine();

            System.out.println("Your height is: " + height + " meters");


            // 4. Reading a Single Token

            System.out.print("\nEnter your favorite programming language: ");
            String language = keyboard.next();

            System.out.println("Your favorite language is: " + language);

            keyboard.nextLine();


            // 5. Reading a Boolean

            System.out.print("\nAre you learning Java? (true/false): ");
            boolean learningJava = keyboard.nextBoolean();

            System.out.println("Learning Java: " + learningJava);


            // 6. Standard Output and Standard Error

            System.out.println("\nThis message is written to standard output.");
            System.err.println("This message is written to standard error.");
        }

        // try-with-resources closes the Scanner automatically.
        // Closing this Scanner also closes System.in.
    }
}