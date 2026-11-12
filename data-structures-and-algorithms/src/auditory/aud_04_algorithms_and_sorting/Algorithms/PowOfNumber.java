package aud.aud_04_algorithms_and_sorting.Algorithms;

// Задача 3)
// Да се напише функција која ќе го пресмета n-тиот степен на некој број
// со примена на техниката "Раздели и владеј".

public class PowOfNumber {

    static void main(String[] args) {
        double number = 2;
        int exponent = 10;

        System.out.println(number + "^" + exponent + " = " + power(number, exponent));
    }

    // Divide and Conquer: Calculate the power by repeatedly dividing the exponent by 2.
    public static double power(double number, int exponent) {
        if (exponent == 0) {
            return 1;
        }

        double half = power(number, exponent / 2);

        if (exponent % 2 == 0) {
            return half * half;
        }

        return number * half * half;
    }
}