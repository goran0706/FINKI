package impl.Stack;

import java.util.NoSuchElementException;

/**
 * Implements a stack using a fixed-capacity array.
 *
 * <p>The stack follows the Last-In, First-Out (LIFO) principle.
 * Elements are stored consecutively from index {@code 0} to
 * {@code size - 1}. The top element is always at index
 * {@code size - 1}.</p>
 *
 * <p>This implementation does not resize its backing array.
 * Attempting to push an element when the stack is full results
 * in an {@link IllegalStateException}.</p>
 *
 * <p>Null elements are permitted.</p>
 *
 * @param <E> the type of elements stored in the stack
 */
public class ArrayStack<E> implements Stack<E> {

    /**
     * Maximum number of elements the stack can hold.
     */
    private final E[] elements;

    /**
     * Number of elements currently stored in the stack.
     *
     * <p>Also represents the index where the next element
     * will be inserted.</p>
     */
    private int size;

    /**
     * Constructs an empty stack with the specified capacity.
     *
     * @param capacity maximum number of elements
     * @throws IllegalArgumentException if capacity is negative
     */
    @SuppressWarnings("unchecked")
    public ArrayStack(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("Stack capacity cannot be negative: " + capacity);
        }

        elements = (E[]) new Object[capacity];
        size = 0;
    }

    /**
     * {@inheritDoc}
     *
     * @return {@code true} if the stack is empty
     */
    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * {@inheritDoc}
     *
     * @throws NoSuchElementException if the stack is empty
     */
    @Override
    public E peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Stack is empty");
        }

        return elements[size - 1];
    }

    /**
     * {@inheritDoc}
     *
     * <p>Occupied array positions are set to {@code null}
     * to release references to removed elements.</p>
     */
    @Override
    public void clear() {
        for (int i = 0; i < size; i++) {
            elements[i] = null;
        }

        size = 0;
    }

    /**
     * {@inheritDoc}
     *
     * @throws IllegalStateException if the stack is full
     */
    @Override
    public void push(E element) {
        if (size == elements.length) {
            throw new IllegalStateException("Stack is full");
        }

        elements[size] = element;
        size++;
    }

    /**
     * {@inheritDoc}
     *
     * @throws NoSuchElementException if the stack is empty
     */
    @Override
    public E pop() {
        if (isEmpty()) {
            throw new NoSuchElementException("Stack is empty");
        }

        size--;

        E element = elements[size];

        // Release the reference to the removed element.
        elements[size] = null;

        return element;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int size() {
        return size;
    }

    /**
     * Returns the maximum number of elements the stack can hold.
     *
     * @return the stack capacity
     */
    public int capacity() {
        return elements.length;
    }

    /**
     * Returns a string representation of the stack.
     *
     * <p>Elements are displayed from the top to the bottom.</p>
     *
     * @return string representation of the stack
     */
    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("[");

        for (int i = size - 1; i >= 0; i--) {
            result.append(elements[i]);

            if (i > 0) {
                result.append(", ");
            }
        }

        return result.append("]").toString();
    }
}