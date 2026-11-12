package impl.Queue;

import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * Implements a priority queue using a sorted singly linked list.
 *
 * <p>Elements are maintained in ascending natural order according
 * to their {@link Comparable#compareTo(Object)} implementation.</p>
 *
 * <p>The smallest element has the highest priority and is stored
 * at the front of the queue.</p>
 *
 * <p>Elements with equal priority retain their insertion order
 * (FIFO ordering for equal elements).</p>
 *
 * <p>Null elements are not permitted.</p>
 *
 * @param <E> the type of elements, which must implement Comparable
 */
public class PriorityQueue<E extends Comparable<? super E>> implements Queue<E> {

    /**
     * Reference to the node with the highest priority.
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
     * Constructs an empty priority queue.
     */
    public PriorityQueue() {
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
            throw new NoSuchElementException("Priority queue is empty");
        }

        return front.element;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void clear() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * Inserts an element while maintaining ascending order.
     *
     * <p>The new element is inserted before the first element
     * that is strictly greater than it. Consequently, elements
     * with equal values remain in their original insertion order.</p>
     *
     * @param element the element to insert
     * @throws NullPointerException if the element is null
     */
    @Override
    public void enqueue(E element) {
        Objects.requireNonNull(element, "Priority queue does not allow null elements");

        Node<E> newNode = new Node<>(element);

        // Case 1: The queue is empty.
        if (isEmpty()) {
            front = newNode;
            rear = newNode;
        }

        // Case 2: The new element has the highest priority.
        else if (element.compareTo(front.element) < 0) {
            newNode.next = front;
            front = newNode;
        }

        // Case 3: Find the correct insertion position.
        else {
            Node<E> current = front;

            // Move past elements that are smaller than or equal
            // to the new element to preserve FIFO ordering for ties.
            while (current.next != null && element.compareTo(current.next.element) >= 0) {
                current = current.next;
            }

            newNode.next = current.next;
            current.next = newNode;

            // Update rear if the new element was inserted last.
            if (newNode.next == null) {
                rear = newNode;
            }
        }

        size++;
    }

    /**
     * Removes and returns the element with the highest priority.
     *
     * <p>Because the queue is sorted, the highest-priority element
     * is always at the front.</p>
     *
     * @return the removed element
     * @throws NoSuchElementException if the queue is empty
     */
    @Override
    public E dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Priority queue is empty");
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
     * Returns a string representation of the priority queue.
     *
     * <p>Elements are displayed from highest to lowest priority.</p>
     *
     * @return string representation of the priority queue
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
     * Represents one node in the priority queue.
     */
    private static class Node<E> {

        private final E element;
        private Node<E> next;

        private Node(E element) {
            this.element = element;
        }
    }
}