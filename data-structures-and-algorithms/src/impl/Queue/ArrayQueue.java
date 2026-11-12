package impl.Queue;

import java.util.NoSuchElementException;

/**
 * Implements a queue using a fixed-capacity circular array.
 *
 * <p>The queue follows the First-In, First-Out (FIFO) principle.</p>
 *
 * <p>The array is circular: when an index reaches the end of the
 * array, it wraps around to index zero. This allows the queue to
 * reuse positions freed by dequeue operations without shifting
 * existing elements.</p>
 *
 * <p>This implementation does not resize its backing array.</p>
 *
 * <p>Null elements are permitted.</p>
 *
 * @param <E> the type of elements stored in the queue
 */
public class ArrayQueue<E> implements Queue<E> {

    /**
     * Array containing the queue elements.
     */
    private final E[] elements;

    /**
     * Index of the front element.
     */
    private int front;

    /**
     * Index where the next element will be inserted.
     */
    private int rear;

    /**
     * Number of elements currently stored in the queue.
     */
    private int size;

    /**
     * Constructs an empty queue with the specified capacity.
     *
     * @param capacity maximum number of elements
     * @throws IllegalArgumentException if capacity is negative
     */
    @SuppressWarnings("unchecked")
    public ArrayQueue(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("Queue capacity cannot be negative: " + capacity);
        }

        elements = (E[]) new Object[capacity];

        front = 0;
        rear = 0;
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
     * Returns the maximum number of elements the queue can hold.
     *
     * @return the queue capacity
     */
    public int capacity() {
        return elements.length;
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

        return elements[front];
    }

    /**
     * {@inheritDoc}
     *
     * <p>Occupied positions are cleared to release references
     * to removed elements.</p>
     */
    @Override
    public void clear() {
        for (int i = 0; i < size; i++) {
            elements[(front + i) % elements.length] = null;
        }

        front = 0;
        rear = 0;
        size = 0;
    }

    /**
     * {@inheritDoc}
     *
     * <p>The rear index wraps around to zero when it reaches
     * the end of the backing array.</p>
     *
     * @throws IllegalStateException if the queue is full
     */
    @Override
    public void enqueue(E element) {
        if (size == elements.length) {
            throw new IllegalStateException("Queue is full");
        }

        elements[rear] = element;
        rear = (rear + 1) % elements.length;
        size++;
    }

    /**
     * {@inheritDoc}
     *
     * <p>The front index advances circularly after removal.</p>
     *
     * @throws NoSuchElementException if the queue is empty
     */
    @Override
    public E dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }

        E element = elements[front];

        elements[front] = null;
        front = (front + 1) % elements.length;
        size--;

        // Normalize indices when the queue becomes empty.
        if (size == 0) {
            front = 0;
            rear = 0;
        }

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

        for (int i = 0; i < size; i++) {
            result.append(elements[(front + i) % elements.length]);

            if (i < size - 1) {
                result.append(", ");
            }
        }

        return result.append("]").toString();
    }
}