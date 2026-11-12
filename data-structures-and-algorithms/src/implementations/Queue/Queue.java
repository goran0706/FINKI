package impl.Queue;

import java.util.NoSuchElementException;

/**
 * Defines the Queue abstract data type (ADT).
 *
 * <p>A queue is a linear data structure that follows the
 * First-In, First-Out (FIFO) principle. The first element
 * inserted is the first element removed.</p>
 *
 * @param <E> the type of elements stored in the queue
 */
public interface Queue<E> {

    /**
     * Checks whether the queue contains no elements.
     *
     * @return {@code true} if the queue is empty
     */
    boolean isEmpty();

    /**
     * Returns the number of elements in the queue.
     *
     * @return the number of elements
     */
    int size();

    /**
     * Returns the element at the front without removing it.
     *
     * @return the front element
     * @throws NoSuchElementException if the queue is empty
     */
    E peek();

    /**
     * Removes all elements from the queue.
     */
    void clear();

    /**
     * Adds an element to the rear of the queue.
     *
     * @param element the element to add
     */
    void enqueue(E element);

    /**
     * Removes and returns the element at the front of the queue.
     *
     * @return the removed front element
     * @throws NoSuchElementException if the queue is empty
     */
    E dequeue();
}