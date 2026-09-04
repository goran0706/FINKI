package exercises;

import java.util.Scanner;

public class MadLibs {
    public static void main(String[] args) {
        String ADJECTIVE1;
        String ADJECTIVE2;
        String ADJECTIVE3;
        String OCCUPATION1;
        String OCCUPATION2;
        String GIRLS_NAME;
        String BOYS_NAME;
        String MANS_NAME;
        String PLACE;
        String CLOTHING;
        String HOBBY;

        Scanner keyboard = new Scanner(System.in);

        System.out.println("Enter adjective1");
        ADJECTIVE1 = keyboard.nextLine();

        System.out.println("Enter adjective2");
        ADJECTIVE2 = keyboard.nextLine();

        System.out.println("Enter adjective3");
        ADJECTIVE3 = keyboard.nextLine();

        System.out.println("Enter occupation1");
        OCCUPATION1 = keyboard.nextLine();

        System.out.println("Enter occupation2");
        OCCUPATION2 = keyboard.nextLine();

        System.out.println("Enter girls name");
        GIRLS_NAME = keyboard.nextLine();

        System.out.println("Enter boys name");
        BOYS_NAME = keyboard.nextLine();

        System.out.println("Enter mans name");
        MANS_NAME = keyboard.nextLine();

        System.out.println("Enter place");
        PLACE = keyboard.nextLine();

        System.out.println("Enter clothing");
        CLOTHING = keyboard.nextLine();

        System.out.println("Enter hobby");
        HOBBY = keyboard.nextLine();

        System.out.println("There once was a " + ADJECTIVE1 + " girl named " + GIRLS_NAME + ", who was a " + ADJECTIVE2 + " " + OCCUPATION1 + " in the Kingdom of " + PLACE + ".");
        System.out.println("She loved to wear " + CLOTHING + " and to " + HOBBY + ". She wanted to marry the " + ADJECTIVE3 + " " + OCCUPATION2 + " named " + BOYS_NAME + ", but her father, the King " + MANS_NAME + " forbid her from seeing him.");
    }

}
