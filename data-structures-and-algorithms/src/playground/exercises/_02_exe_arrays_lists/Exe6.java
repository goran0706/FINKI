package playground.exercises._02_exe_arrays_lists;

/*
    Дадена е еднострана поврзана листа чии што јазли содржат по еден String.
    Дополнително, даден е и уште еден природен број L.
    Од дадената листа потребно е да се најде последниот јазел којшто содржи String со должина L и да се премести на почеток на листата.

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
    Cloud->Sky->Blue
*/

import java.util.Scanner;

public class Exe6 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        SLL<String> list = new SLL<>();

        int n = input.nextInt();
        for (int i = 0; i < n; i++) {
            list.insertLast(input.next());
        }
        int l = input.nextInt();

        System.out.println(list);

        Node<String> curr = list.getFirst();
        Node<String> found = null;

        while (curr != null) {
            if (curr.elem.length() == l) {
                found = curr;
            }

            curr = curr.succ;
        }

        if (found != null) {
            list.insertFirst(found.elem);
            list.delete(found);
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

            if (first == null) {
                first = ins;
            } else {
                ins.succ = first;
                first = ins;
            }
        }

        public void insertLast(E o) {
            Node<E> ins = new Node<>(o, null);

            if (first == null) {
                first = ins;
                return;
            }

            Node<E> curr = first;

            while (curr.succ != null) {
                curr = curr.succ;
            }

            curr.succ = ins;
        }

        public E deleteFirst() {
            if (first == null) {
                return null;
            }

            E elem = first.elem;
            first = first.succ;

            return elem;
        }

        public E delete(Node<E> del) {
            if (first == null || del == null) {
                return null;
            }

            if (first == del) {
                return deleteFirst();
            }

            Node<E> pred = first;

            while (pred.succ != null && pred.succ != del) {
                pred = pred.succ;
            }

            pred.succ = del.succ;
            return del.elem;
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
