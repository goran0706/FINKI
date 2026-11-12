package impl.Stack;

import impl.SLL.SLLNode;

import java.util.NoSuchElementException;

/**
 * Implements a stack using a singly linked list.
 *
 * <p>The stack follows the Last-In, First-Out (LIFO) principle.
 * The top of the stack is represented by the first node of the
 * linked list.</p>
 *
 * <p>Each node stores an element and a reference to the next node.
 * New elements are inserted at the beginning of the list, and
 * elements are removed from the beginning.</p>
 *
 * <p>Unlike an array-based stack with fixed capacity, this
 * implementation grows dynamically as elements are added,
 * subject to available memory.</p>
 *
 * <p>Null elements are permitted.</p>
 *
 * @param <E> the type of elements stored in the stack
 */
public class LinkedStack<E> implements Stack<E> {

    /**
     * Reference to the node containing the top element.
     *
     * <p>{@code null} when the stack is empty.</p>
     */
    private SLLNode<E> top;

    /**
     * Number of elements currently stored in the stack.
     */
    private int size;

    /**
     * Constructs an empty linked stack.
     */
    public LinkedStack() {
        top = null;
        size = 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isEmpty() {
        return top == null;
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

        return top.getElement();
    }

    /**
     * {@inheritDoc}
     *
     * <p>Removing the reference to the top node makes the
     * previous node the new top. The unreachable node can
     * subsequently be reclaimed by the garbage collector.</p>
     */
    @Override
    public void clear() {
        top = null;
        size = 0;
    }

    /**
     * {@inheritDoc}
     *
     * <p>A new node is inserted at the beginning of the linked list.</p>
     *
     * @param element the element to add
     */
    @Override
    public void push(E element) {
        top = new SLLNode<>(element, top);
        size++;
    }

    /**
     * {@inheritDoc}
     *
     * <p>The top node is removed, and its successor becomes
     * the new top.</p>
     *
     * @throws NoSuchElementException if the stack is empty
     */
    @Override
    public E pop() {
        if (isEmpty()) {
            throw new NoSuchElementException("Stack is empty");
        }

        E element = top.getElement();

        top = top.getSucc();
        size--;

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
     * Returns a string representation of the stack.
     *
     * <p>Elements are displayed from the top to the bottom.</p>
     *
     * @return string representation of the stack
     */
    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("[");

        SLLNode<E> current = top;

        while (current != null) {
            result.append(current.getElement());

            current = current.getSucc();

            if (current != null) {
                result.append(", ");
            }
        }

        return result.append("]").toString();
    }
}