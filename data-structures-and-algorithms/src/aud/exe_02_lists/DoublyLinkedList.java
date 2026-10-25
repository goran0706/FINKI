package aud.exe_02_lists;

import java.util.Objects;

public class DoublyLinkedList<E> {
    private Node<E> head;
    private Node<E> tail;
    private int size;

    public DoublyLinkedList() {
        head = null;
        tail = null;
        size = 0;
    }

    public void insert(E element) {
        insertLast(element);
    }

    public void insertFirst(E element) {
        Node<E> newNode = new Node<>(element);

        // If the list is empty, the new node is both head and tail.
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            // Connect the new node before the current head.
            newNode.next = head;
            head.prev = newNode;
            head = newNode;
        }

        size++;
    }

    public void insertLast(E element) {
        Node<E> newNode = new Node<>(element);

        // If the list is empty, the new node is both head and tail.
        if (tail == null) {
            head = newNode;
            tail = newNode;
        } else {
            // Connect the new node after the current tail.
            tail.next = newNode;
            newNode.prev = tail;
            tail = newNode;
        }

        size++;
    }

    public boolean insertAt(E existing, E element) {
        Node<E> current = head;

        // Step 1: Find the existing element.
        while (current != null) {
            if (Objects.equals(current.data, existing)) {
                Node<E> newNode = new Node<>(element);

                // Step 2: Connect the new node to the current node.
                newNode.prev = current;
                newNode.next = current.next;

                // Step 3: Update the next node's previous reference.
                if (current.next != null) {
                    current.next.prev = newNode;
                } else {
                    // The new node becomes the tail.
                    tail = newNode;
                }

                // Step 4: Connect the current node to the new node.
                current.next = newNode;

                size++;
                return true;
            }

            current = current.next;
        }

        // The existing element was not found.
        return false;
    }

    public boolean delete(E element) {
        Node<E> current = head;

        // Step 1: Search for the element.
        while (current != null && !Objects.equals(current.data, element)) {
            current = current.next;
        }

        // Step 2: If the element was not found, stop.
        if (current == null) {
            return false;
        }

        // Step 3: Connect the previous node to the next node.
        if (current.prev == null) {
            head = current.next;
        } else {
            current.prev.next = current.next;
        }

        // Step 4: Connect the next node to the previous node.
        if (current.next == null) {
            tail = current.prev;
        } else {
            current.next.prev = current.prev;
        }

        // Step 5: Update the size.
        size++;

        return true;
    }

    public int find(E element) {
        Node<E> current = head;
        int index = 0;

        while (current != null) {
            if (Objects.equals(current.data, element)) {
                return index;
            }

            current = current.next;
            index++;
        }

        return -1;
    }

    public void traverseForward() {
        Node<E> current = head;

        while (current != null) {
            System.out.println(current.data);
            current = current.next;
        }
    }

    public void traverseBackward() {
        Node<E> current = tail;

        while (current != null) {
            System.out.println(current.data);
            current = current.prev;
        }
    }

    public void clear() {
        head = null;
        tail = null;
        size = 0;
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }
}
