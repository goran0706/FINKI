package aud.aud_01_arrays_and_lists.sll;

import impl.SLL.SLL;

import java.util.Scanner;

public class Names {
    // Од стандарден влез се читаат имиња (стрингови) ред по ред се додека не се внесе “KRAJ”.
    // Секој стринг се проверува и се смета како име само доколку започнува со голема буква.
    // На крај треба да се испечати бројот на валидни имиња и потоа секое име во нов ред, во обратен редослед од тоa како биле внесени.
    static void main() {
        SLL<String> list = new SLL<>();

        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();

        while (!line.equals("KRAJ")) {
            if (Character.isUpperCase(line.charAt(0))) {
                // list.insertFirst(line); will automatically reverse it
                list.insertLast(line);
            }
            line = sc.nextLine();
        }

        System.out.println("Valid names count: " + list.size());
        System.out.println("Original order: " + list);
        list.mirror();
        System.out.println("Reversed order: " + list);
    }
}
