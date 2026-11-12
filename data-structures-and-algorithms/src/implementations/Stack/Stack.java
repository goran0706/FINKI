package impl.Stack;

/**
 * Defines the Stack abstract data type (ADT).
 *
 * <p>A stack is a linear data structure that follows the
 * Last-In, First-Out (LIFO) principle. The last element
 * added to the stack is the first one to be removed.</p>
 *
 * @param <E> the type of elements stored in the stack
 */
public interface Stack<E> {

    /**
     * Checks whether the stack contains no elements.
     *
     * @return {@code true} if the stack is empty; otherwise {@code false}
     */
    boolean isEmpty();

    /**
     * Returns the element at the top of the stack without removing it.
     *
     * @return the top element
     * @throws java.util.NoSuchElementException if the stack is empty
     */
    E peek();

    /**
     * Removes all elements from the stack.
     *
     * <p>After this operation, the stack is empty.</p>
     */
    void clear();

    /**
     * Adds an element to the top of the stack.
     *
     * @param element the element to add
     * @throws IllegalStateException if the stack has reached its capacity
     */
    void push(E element);

    /**
     * Removes and returns the element at the top of the stack.
     *
     * @return the removed top element
     * @throws java.util.NoSuchElementException if the stack is empty
     */
    E pop();

    /**
     * Returns the number of elements currently stored in the stack.
     *
     * @return the number of elements
     */
    int size();
}
