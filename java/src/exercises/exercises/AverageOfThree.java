package exercises;

import java.util.Scanner;

public class AverageOfThree {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        double num1;
        double num2;
        double num3;
        double average;

        System.out.println("Please enter three numbers");
        num1 = input.nextDouble();
        num2 = input.nextDouble();
        num3 = input.nextDouble();
        input.nextLine(); //good habit

        average = (num1 + num2 + num3) / 3;
        System.out.println("Average is: " + average);
    }
}
