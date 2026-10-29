package playground.exercises._02_exe_arrays_lists;

import java.util.Scanner;

/*
    Дадена е еднострана поврзана листа чии што јазли содржат по еден String.
    Дополнително, даден е и уште еден природен број L.
    Во дадената листа потребно е сите јазли коишто содржат String со должина L да се поместат на крај на листата,
    задржувајќи го и оригиналниот распоред на елементите.

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


    4
    Apple
    Banana
    Pear
    Watermelon
    6

    Apple->Banana->Pear->Watermelon
    Apple->Pear->Watermelon->Banana
*/
public class Exe5 {
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

        while (curr != null) {
            // Save next node to progress the list
            Node<String> next = curr.succ;

            if (curr.elem.length() == l) {
                list.insertLast(curr.elem);
                list.delete(curr);
            }

            // Use saved node
            curr = next;
        }

        System.out.println(list);
    }

    public static class Node<E> {
        protected E elem;
        protected Node<E> succ;

        Node(E o, Node<E> node) {
            elem = o;
            succ = node;
        }
    }

    public static class SLL<E> {
        private Node<E> first;

        SLL() {
            first = null;
        }

        public Node<E> getFirst() {
            return first;
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

            Node<E> curr = first;

            while (curr.succ != null && curr.succ != del) {
                curr = curr.succ;
            }

            curr.succ = del.succ;
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
