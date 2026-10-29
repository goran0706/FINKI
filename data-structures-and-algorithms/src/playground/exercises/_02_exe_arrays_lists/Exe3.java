package playground.exercises._02_exe_arrays_lists;

/*
    Дадена е еднострана поврзана листа чии што јазли содржат по еден String.
    Дополнително, даден е и уште еден природен број L.
    Во дадената листа после секој јазол којшто содржи String со должина L да се вметне нов јазол со вредност "Target".

    Влез:
    Во првиот ред од влезот е даден бројот на елементи во листата - N,
    па во следните N редови се дадени самите елементи (String-ови) од листата.
    На крај, во последниот ред е даден бројот L.

    Излез:
    На излез треба да се испечати листата пред и после промената.

    For example:
    Input

    3
    Sky
    Blue
    Cloud
    5

    Result
    Sky->Blue->Cloud
    Sky->Blue->Cloud->Target
*/

import java.util.Scanner;

public class Exe3 {
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
            if (curr.elem.length() == l) {
                list.insertAfter("Target", curr);
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

        public void insertLast(E elem) {
            Node<E> ins = new Node<>(elem, null);

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

        public void insertAfter(E o, Node<E> target) {
            if (target == null) {
                return;
            }

            Node<E> ins = new Node<>(o, target.succ);

            if (first == null) {
                first = ins;
            } else {
                target.succ = ins;
            }
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();

            Node<E> curr = first;

            while (curr != null) {
                sb.append(curr.elem);

                if (curr.succ != null) {
                    sb.append("->");
                }

                curr = curr.succ;
            }

            return sb.toString();
        }
    }
}
