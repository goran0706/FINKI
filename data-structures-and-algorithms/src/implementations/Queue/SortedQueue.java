package impl.Queue;

import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * Implements a sorted queue using a singly linked list.
 *
 * <p>Elements are maintained in ascending natural order.
 * The smallest element is always at the front of the queue.</p>
 *
 * <p>Unlike a regular queue, elements are not necessarily
 * inserted at the rear. Each element is inserted at its
 * appropriate sorted position.</p>
 *
 * <p>Elements with equal values preserve their insertion order.</p>
 *
 * <p>Null elements are not permitted.</p>
 *
 * @param <E> the type of elements stored in the queue;
 *            must implement Comparable
 */
public class SortedQueue<E extends Comparable<? super E>> implements Queue<E> {

    /**
     * Reference to the smallest element.
     */
    private Node<E> front;
    /**
     * Reference to the last element.
     */
    private Node<E> rear;
    /**
     * Number of elements in the queue.
     */
    private int size;

    /**
     * Constructs an empty sorted queue.
     */
    public SortedQueue() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * Checks whether the queue is empty.
     *
     * @return true if the queue contains no elements
     */
    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Returns the number of elements in the queue.
     *
     * @return the number of elements
     */
    @Override
    public int size() {
        return size;
    }

    /**
     * Returns the smallest element without removing it.
     *
     * @return the front element
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
     * Removes all elements from the queue.
     */
    @Override
    public void clear() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * Inserts an element into its correct sorted position.
     *
     * <p>The queue maintains ascending order after every insertion.</p>
     *
     * <p>When elements have equal values, the new element is
     * inserted after existing elements with the same value.
     * This preserves FIFO ordering for equal elements.</p>
     *
     * @param element the element to insert
     * @throws NullPointerException if the element is null
     */
    @Override
    public void enqueue(E element) {
        Objects.requireNonNull(element, "Element cannot be null");

        Node<E> newNode = new Node<>(element);

        // Case 1: Insert into an empty queue.
        if (isEmpty()) {
            front = rear = newNode;
        }

        // Case 2: Insert before the current front.
        else if (element.compareTo(front.element) < 0) {
            newNode.next = front;
            front = newNode;
        }

        // Case 3: Find the correct insertion position.
        else {
            Node<E> current = front;

            // Move past elements smaller than or equal to the new element.
            while (current.next != null && element.compareTo(current.next.element) >= 0) {
                current = current.next;
            }

            newNode.next = current.next;
            current.next = newNode;

            // Update rear if the element was inserted at the end.
            if (newNode.next == null) {
                rear = newNode;
            }
        }

        size++;
    }

    /**
     * Removes and returns the smallest element.
     *
     * @return the removed front element
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

        if (front == null) {
            rear = null;
        }

        removedNode.next = null;

        return element;
    }

    /**
     * Returns a string representation of the queue.
     *
     * <p>Elements are displayed in ascending order.</p>
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
     * Represents a node in the sorted queue.
     */
    private static class Node<E> {

        private final E element;
        private Node<E> next;

        private Node(E element) {
            this.element = element;
        }
    }
}