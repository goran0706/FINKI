package playground.exercises._02_exe_arrays_lists;

/*
    Дадена е еднострана поврзана листа чии што јазли содржат по еден String.
    Дополнително, даден е и уште еден природен број L.
    Од дадената листа потребно е да се избрише секој јазел којшто содржи String со должина помала од L.

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
    Cloud
*/

import java.util.Scanner;

class Node<E> {
    protected E elem;
    protected Node<E> succ;

    Node(E elem, Node<E> succ) {
        this.elem = elem;
        this.succ = succ;
    }
}

class SLL<E> {
    private Node<E> first;

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

        if (curr.succ == null) {
            return null;
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

public class Exe2 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        SLL<String> list = new SLL<>();

        int n = input.nextInt();

        for (int i = 0; i < n; i++) {
            list.insertLast(input.next());
        }

        System.out.println(list);

        int l = input.nextInt();
        Node<String> curr = list.getFirst();

        while (curr != null) {
            Node<String> next = curr.succ;

            if (curr.elem.length() < l) {
                list.delete(curr);
            }

            curr = next;
        }

        System.out.println(list);
    }
}