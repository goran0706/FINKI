package impl.Queue;

import java.util.NoSuchElementException;

/**
 * Implements a queue using a singly linked list.
 *
 * <p>The queue follows the First-In, First-Out (FIFO) principle.</p>
 *
 * <p>The {@code front} reference points to the first node,
 * and the {@code rear} reference points to the last node.</p>
 *
 * <p>New elements are inserted at the rear, while elements
 * are removed from the front.</p>
 *
 * <p>The queue grows dynamically and has no predefined capacity.</p>
 *
 * <p>Null elements are permitted.</p>
 *
 * @param <E> the type of elements stored in the queue
 */
public class LinkedQueue<E> implements Queue<E> {

    /**
     * Reference to the first node.
     */
    private Node<E> front;
    /**
     * Reference to the last node.
     */
    private Node<E> rear;
    /**
     * Number of elements currently stored in the queue.
     */
    private int size;

    /**
     * Constructs an empty linked queue.
     */
    public LinkedQueue() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int size() {
        return size;
    }

    /**
     * {@inheritDoc}
     *
     * @throws NoSuchElementException if the queue is empty
     */
    @Override
    public E peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }

        return front.element;
    }

    /**
     * {@inheritDoc}
     *
     * <p>All references to the first and last nodes are released.</p>
     */
    @Override
    public void clear() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * {@inheritDoc}
     *
     * <p>A new node is appended after the current rear node.</p>
     */
    @Override
    public void enqueue(E element) {
        Node<E> newNode = new Node<>(element);

        if (isEmpty()) {
            front = newNode;
            rear = newNode;
        } else {
            rear.next = newNode;
            rear = newNode;
        }

        size++;
    }

    /**
     * {@inheritDoc}
     *
     * <p>The first node is removed, and its successor becomes
     * the new front node.</p>
     *
     * @throws NoSuchElementException if the queue is empty
     */
    @Override
    public E dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }

        Node<E> removedNode = front;
        E element = removedNode.element;

        front = front.next;
        size--;

        // The queue must have both references set to null when empty.
        if (front == null) {
            rear = null;
        }

        // Detach the removed node.
        removedNode.next = null;

        return element;
    }

    /**
     * Returns a string representation of the queue.
     *
     * <p>Elements are displayed from front to rear.</p>
     *
     * @return string representation of the queue
     */
    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("[");

        Node<E> current = front;

        while (current != null) {
            result.append(current.element);

            current = current.next;

            if (current != null) {
                result.append(", ");
            }
        }

        return result.append("]").toString();
    }

    /**
     * Represents one node in the linked queue.
     */
    private static class Node<E> {

        private final E element;
        private Node<E> next;

        private Node(E element) {
            this.element = element;
        }
    }
}