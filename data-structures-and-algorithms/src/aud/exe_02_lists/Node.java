package aud.exe_02_lists;

public class Node<E> {
    E data;
    Node<E> next;
    Node<E> prev;

    Node(E data) {
        this.data = data;
    }
}
