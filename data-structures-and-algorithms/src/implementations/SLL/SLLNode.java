package impl.SLL;

/**
 * Represents a node in a singly linked list.
 *
 * <p>Each node contains:
 * <ul>
 *     <li>An element of type E.</li>
 *     <li>A reference to the next node (successor).</li>
 * </ul>
 *
 * <p>The successor reference is managed by the SLL implementation
 * to protect the linked-list structure.
 *
 * @param <E> type of the stored element
 */
public class SLLNode<E> {

    /**
     * Element stored in this node.
     */
    private E element;

    /**
     * Reference to the next node.
     * Null indicates the last node.
     */
    private SLLNode<E> succ;

    /**
     * Creates a node with the specified element and successor.
     *
     * @param element element to store
     * @param succ    reference to the next node
     */
    public SLLNode(E element, SLLNode<E> succ) {
        this.element = element;
        this.succ = succ;
    }

    /**
     * Returns the element stored in this node.
     *
     * @return stored element
     */
    public E getElement() {
        return element;
    }

    /**
     * Updates the element stored in this node.
     *
     * @param element new element
     */
    public void setElement(E element) {
        this.element = element;
    }

    /**
     * Returns the successor of this node.
     *
     * @return next node, or null if this is the last node
     */
    public SLLNode<E> getSucc() {
        return succ;
    }

    /**
     * Updates the successor reference.
     *
     * <p>Package-private because link manipulation belongs
     * to the singly linked list implementation.
     *
     * @param succ new successor
     */
    void setSucc(SLLNode<E> succ) {
        this.succ = succ;
    }
}