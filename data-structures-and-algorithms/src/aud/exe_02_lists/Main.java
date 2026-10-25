package aud.exe_02_lists;

public class Main {
    static void main(String[] args) {
        // Задача 2)
        // Да се напише функција којашто за дадена еднострано поврзана листа од цели броеви
        // ќе го врати бројот на парни елементи во истата.
        SinglyLinkedList<Integer> list = new SinglyLinkedList<>();

        int size = 10;
        for (int i = 1; i < size; i++) {
            list.insert(i);

        }

        int evenElements = ListUtils.countEvenNumbers(list);
        System.out.println(evenElements);
    }
}
