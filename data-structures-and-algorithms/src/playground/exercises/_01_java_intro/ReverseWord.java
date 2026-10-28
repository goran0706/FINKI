package playground.exercises._01_java_intro;

/*
    За даден збор кој се внесува од стандарден влез, да се испечати истиот превртен.
    На влез во првиот ред се дава број на зборови кои ќе се внесуваат.
    Во наредните линии се внесуваат самите зборови.

    For example:
    Input

    3
    one
    two
    three

    Result
    eno
    owt
    eerht
*/

import java.util.Scanner;

public class ReverseWord {
    // Time complexity: O(n)
    // Space complexity: O(n)
    public static void printReversed(String word) {
        if (word.isEmpty()) {
            System.out.println("Empty word.");
        } else {
            StringBuilder result = new StringBuilder();

            for (int i = word.length() - 1; i >= 0; i--) {
                result.append(word.charAt(i));
            }

            System.out.println(result);
        }
    }

    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();

        for (int i = 0; i < n; i++) {
            String word = scanner.next();
            printReversed(word);
        }
    }
}
