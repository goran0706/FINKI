package labs.exe_02_lists;

import java.util.Objects;

public class SinglyLinkedList<E> {
    private Node<E> head;
    private Node<E> tail;
    private int size;

    public SinglyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // TASK METHODS

    public void insertFirst(E o) {
        Node<E> node = new Node<>(o);

        if (head == null) {
            head = node;
            tail = node;
        } else {
            node.next = head;
            head = node;
        }

        size++;
    }

    public void insertLast(E o) {
        Node<E> node = new Node<>(o);

        if (head == null) {
            head = node;
            tail = node;
        } else {
            tail.next = node;
            tail = node;
        }

        size++;
    }

    public void insertAfter(E o, Node<E> node) {
        if (node == null) {
            throw new IllegalArgumentException("Node is null");
        }

        node.next = new Node<>(o, node.next);

        if (node == tail) {
            tail = node.next;
        }

        size++;
    }

    public void insertBefore(E o, Node<E> node) {
        if (node == null) {
            throw new IllegalArgumentException("Node is null");
        }

        if (node == head) {
            insertFirst(o);
        } else {
            Node<E> current = head;

            while (current.next != null && current.next != node) {
                current = current.next;
            }

            if (current.next == null) {
                throw new IllegalArgumentException("Node not found");
            }

            current.next = new Node<>(o, current.next);
            size++;
        }
    }

    public Node<E> getFirst() {
        return head;
    }

    public int getSize() {
        return size;
    }

    public Node<E> find(E o) {
        Node<E> node = head;

        while (node != null) {
            if (Objects.equals(node.data, o)) {
                return node;
            }

            node = node.next;
        }

        return null;
    }

    public void deleteList() {
        head = null;
        tail = null;
        size = 0;
    }

    public E deleteFirst() {
        if (head == null) {
            throw new IllegalArgumentException("List is empty");
        }

        E data = head.data;
        head = head.next;
        size--;

        if (head == null) {
            tail = null;
        }

        return data;
    }

    public E deleteLast() {
        if (head == null) {
            throw new IllegalArgumentException("List is empty");
        }

        if (head.next == null) {
            E data = head.data;
            head = null;
            tail = null;
            size--;
            return data;
        }

        Node<E> node = head;

        while (node.next.next != null) {
            node = node.next;
        }

        E data = tail.data;
        tail = node;
        tail.next = null;
        size--;

        return data;
    }

    public E delete(Node<E> node) {
        if (head == null) {
            throw new IllegalArgumentException("List is empty");
        }

        if (head == node) {
            return deleteFirst();
        }

        Node<E> current = head;

        // Node before target node
        while (current.next != null && current.next != node) {
            current = current.next;
        }

        if (current.next == null) {
            throw new IllegalArgumentException("Element not found");
        }

        current.next = node.next;
        size--;

        if (tail == node) {
            tail = current;
        }

        return node.data;
    }

//    public void merge(){}
//    public void mirror() {}

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        if (head == null) {
            sb.append("Empty list");
        } else {
            Node<E> node = head;
            sb.append(node.data);

            while (node.next != null) {
                node = node.next;
                sb.append("->").append(node.data);
            }
        }

        return sb.toString();
    }
}
