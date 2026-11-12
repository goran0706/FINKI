package aud.aud_01_arrays_and_lists.sll;

import impl.SLL.SLL;

public class MirrorListElements {
    // Да се напише функција што ги превртува сите врски во еднострано поврзана листа.
    // Веќе има имплементирано метод mirror() во SLL
    // Уште еден начин надвор од класата е со користење на привремена листа и ќе користиме:
    // - insertFirst ќе ги гура елементите од оригиналната листа
    // - бришеме од оригиналната листа
    // - повторно ги вметнуваме елементите од оригиналната листа

    public static void reverseList(SLL<Character> list) {
        SLL<Character> reversed = new SLL<>();

        while (!list.isEmpty()) {
            reversed.insertFirst(list.deleteFirst());
        }

        while (!reversed.isEmpty()) {
            list.insertLast(reversed.deleteFirst());
        }
    }

    static void main() {
        SLL<Character> list = new SLL<>();
        list.insertLast('F');
        list.insertLast('O');
        list.insertLast('R');
        list.insertLast('W');
        list.insertLast('A');
        list.insertLast('R');
        list.insertLast('D');

        list.mirror();
        System.out.println(list);

        reverseList(list);
        System.out.println(list);
    }
}
