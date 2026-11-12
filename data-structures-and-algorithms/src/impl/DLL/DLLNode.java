package impl.DLL;

/**
 * Represents a node in a doubly linked list.
 *
 * <p>Each node contains:
 * <ul>
 *     <li>An element of type E.</li>
 *     <li>A reference to its predecessor (pred).</li>
 *     <li>A reference to its successor (succ).</li>
 * </ul>
 *
 * <p>The predecessor and successor references are managed by DLL.
 *
 * @param <E> type of the stored element
 */
public class DLLNode<E> {

    /**
     * Element stored in this node.
     */
    private E element;

    /**
     * Reference to the previous node.
     *
     * <p>Null if this is the first node.
     */
    private DLLNode<E> pred;

    /**
     * Reference to the next node.
     *
     * <p>Null if this is the last node.
     */
    private DLLNode<E> succ;

    /**
     * Creates a node with the specified element and neighboring nodes.
     *
     * @param element element to store
     * @param pred    predecessor node
     * @param succ    successor node
     */
    public DLLNode(E element, DLLNode<E> pred, DLLNode<E> succ) {
        this.element = element;
        this.pred = pred;
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
     * Replaces the stored element.
     *
     * @param element new element
     */
    public void setElement(E element) {
        this.element = element;
    }

    /**
     * Returns the predecessor node.
     *
     * @return predecessor, or null if this is the first node
     */
    public DLLNode<E> getPred() {
        return pred;
    }

    /**
     * Updates the predecessor reference.
     *
     * @param pred new predecessor
     */
    void setPred(DLLNode<E> pred) {
        this.pred = pred;
    }

    /**
     * Returns the successor node.
     *
     * @return successor, or null if this is the last node
     */
    public DLLNode<E> getSucc() {
        return succ;
    }

    /**
     * Updates the successor reference.
     *
     * @param succ new successor
     */
    void setSucc(DLLNode<E> succ) {
        this.succ = succ;
    }

    /**
     * Returns the string representation of the stored element.
     *
     * @return string representation, or "null" if the element is null
     */
    @Override
    public String toString() {
        return String.valueOf(element);
    }
}