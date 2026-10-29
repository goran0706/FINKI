package playground.exercises._02_exe_arrays_lists;


/*
    Дадена е еднострана поврзана листа чии што јазли содржат по еден String.
    Дополнително, даден е и уште еден природен број L.
    Во дадената листа пред секој јазол којшто содржи String со должина поголема од L да се вметне нов јазол со вредност "Outlier".

    Влез:
    Во првиот ред од влезот е даден бројот на елементи во листата - N,
    па во следните N редови се дадени самите елементи (String-ови) од листата.
    На крај, во последниот ред е даден бројот L.

    Излез:
    На излез треба да се испечати листата пред и после промената.

    For example:
    Input 	Result

    3
    Sky
    Blue
    Cloud
    5

    Sky->Blue->Cloud
    Sky->Blue->Cloud


    1
    Hello
    4

    Hello
    Outlier->Hello


    3
    Big
    Elephant
    Small
    6

    Big->Elephant->Small
    Big->Outlier->Elephant->Small
*/

import java.util.Scanner;

public class Exe4 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        SLL<String> list = new SLL<>();

        int n = input.nextInt();

        for (int i = 0; i < n; i++) {
            String word = input.next();
            list.insertLast(word);
        }

        int l = input.nextInt();

        System.out.println(list);

        Node<String> curr = list.getFirst();

        while (curr != null) {
            if (curr.elem.length() > l) {
                list.insertBefore("Outlier", curr);
            }

            curr = curr.succ;
        }


        System.out.println(list);
    }

    private static class Node<E> {
        protected E elem;
        protected Node<E> succ;

        Node(E o, Node<E> node) {
            elem = o;
            succ = node;
        }
    }

    private static class SLL<E> {
        private Node<E> first;

        SLL() {
            first = null;
        }

        public Node<E> getFirst() {
            return first;
        }

        public void insertFirst(E o) {
            Node<E> ins = new Node<>(o, null);
            ins.succ = first;
            first = ins;
        }

        public void insertLast(E o) {
            Node<E> ins = new Node<>(o, null);

            if (first == null) {
                first = ins;
            } else {
                Node<E> curr = first;

                while (curr.succ != null) {
                    curr = curr.succ;
                }

                curr.succ = ins;
            }
        }

        public void insertBefore(E o, Node<E> target) {
            if (target == null) {
                return;
            }

            if (first == null || first == target) {
                insertFirst(o);
                return;
            }

            Node<E> ins = new Node<>(o, null);

            Node<E> curr = first;

            while (curr != null && curr.succ != target) {
                curr = curr.succ;
            }

            if (curr != null) {
                curr.succ = ins;
                ins.succ = target;
            }
        }

        @Override
        public String toString() {
            StringBuilder result = new StringBuilder();

            Node<E> curr = first;


            while (curr != null) {
                result.append(curr.elem);

                if (curr.succ != null) {
                    result.append("->");
                }

                curr = curr.succ;
            }

            return result.toString();
        }
    }
}
