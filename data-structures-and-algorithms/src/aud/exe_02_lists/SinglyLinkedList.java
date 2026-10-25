package aud.exe_02_lists;

import java.util.Objects;

// 1. Singly Linked List (SLL)

// Basic operations
// 1. createEmpty() — Create an empty list.
// 2. traverse() — Traverse the list.
// 3. find(E element) — Search for an element.
// 4. insert(E element) — Insert an element.
// 5. delete(E element) — Delete an element.
// 6. clear() — Delete all elements.

// Insertion cases
// - Insert into an empty list.
// - Insert at the beginning of a nonempty list.
// - Insert at the end of a nonempty list.
// - Insert between two nodes.

// Deletion cases
// - Delete the only node.
// - Delete the first node when the list has multiple nodes.
// - Delete the last node when the list has multiple nodes.
// - Delete a middle node.

public class SinglyLinkedList<E> {
    private Node<E> head;
    private Node<E> tail;
    private int size;

    public SinglyLinkedList() {
        head = null;
        tail = null;
        size = 0;
    }

    public void insert(E element) {
        insertLast(element);
    }

    public void insertFirst(E element) {
        Node<E> newNode = new Node<>(element);

        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            newNode.next = head;
            head = newNode;
        }

        size++;
    }

    public void insertLast(E element) {
        Node<E> newNode = new Node<>(element);

        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }

        size++;
    }

    public boolean insertAt(E existing, E element) {
        Node<E> current = head;

        while (current != null) {
            if (Objects.equals(current.data, existing)) {
                Node<E> newNode = new Node<>(element);
                newNode.next = current.next;
                current.next = newNode;

                if (current == tail) {
                    tail = newNode;
                }

                size++;
                return true;
            }

            current = current.next;
        }

        return false;
    }

    public boolean delete(E element) {
        Node<E> current = head;
        Node<E> previous = null;

        // Step 1: Search for the element.
        while (current != null && !Objects.equals(current.data, element)) {
            previous = current;
            current = current.next;
        }

        // Step 2: If the element was not found, stop.
        if (current == null) {
            return false;
        }

        // Step 3: Remove the node by updating the links.
        if (previous == null) {
            head = current.next;       // The first node is being deleted.
        } else {
            previous.next = current.next;
        }

        // Step 4: If the last node was deleted, update tail.
        if (current == tail) {
            tail = previous;
        }

        // Step 5: Update the size.
        size--;

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

    public Node<E> getHead() {
        return this.head;
    }

    public void traverse() {
        Node<E> current = head;

        while (current != null) {
            System.out.println(current.data);
            current = current.next;
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
