package impl.SLL;

import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * Generic singly linked list implementation.
 *
 * <p>Each node stores an element and a reference to its successor.
 * The list maintains references to its first and last nodes.
 *
 * <p>Structural invariants:
 * <ul>
 *     <li>first == null if and only if last == null.</li>
 *     <li>size == 0 if and only if the list is empty.</li>
 *     <li>last.succ == null when the list is not empty.</li>
 *     <li>Exactly size nodes are reachable from first.</li>
 *     <li>The list never contains cycles.</li>
 * </ul>
 *
 * <p>Null elements are permitted.
 *
 * <p>Time complexity:
 * <ul>
 *     <li>Insert first: O(1)</li>
 *     <li>Insert last: O(1)</li>
 *     <li>Insert after: O(1), excluding membership validation</li>
 *     <li>Insert before: O(n)</li>
 *     <li>Delete first: O(1)</li>
 *     <li>Delete node: O(n)</li>
 *     <li>Find: O(n)</li>
 *     <li>Size: O(1)</li>
 *     <li>Mirror: O(n)</li>
 *     <li>Merge: O(1)</li>
 * </ul>
 *
 * <p>Space complexity: O(n).
 *
 * @param <E> type of elements stored in the list
 */
public class SLL<E> {

    /**
     * Reference to the first node.
     */
    private SLLNode<E> first;

    /**
     * Reference to the last node.
     */
    private SLLNode<E> last;

    /**
     * Number of elements in the list.
     */
    private int size;

    /**
     * Constructs an empty singly linked list.
     */
    public SLL() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    /**
     * Removes all elements from the list.
     *
     * <p>All references maintained by the list are cleared.
     */
    public void deleteList() {
        SLLNode<E> current = first;

        // Detach every node from the list.
        while (current != null) {
            SLLNode<E> next = current.getSucc();
            current.setSucc(null);
            current = next;
        }

        first = null;
        last = null;
        size = 0;
    }

    /**
     * Returns the number of elements in the list.
     *
     * @return number of nodes
     * <p>
     * Time complexity: O(1).
     */
    public int size() {
        return size;
    }

    /**
     * Checks whether the list is empty.
     *
     * @return true if the list contains no elements
     * <p>
     * Time complexity: O(1).
     */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Returns a string representation of the list.
     *
     * <p>Elements are separated by arrows.
     * An empty list is represented by "Prazna lista!!!".
     *
     * @return string representation
     * <p>
     * Time complexity: O(n).
     */
    @Override
    public String toString() {
        if (isEmpty()) {
            return "Prazna lista!!!";
        }

        StringBuilder result = new StringBuilder();

        SLLNode<E> current = first;

        while (current != null) {
            if (!result.isEmpty()) {
                result.append("->");
            }

            result.append(current.getElement());
            current = current.getSucc();
        }

        return result.toString();
    }

    /**
     * Inserts an element at the beginning of the list.
     *
     * @param element element to insert
     *                <p>
     *                Time complexity: O(1).
     */
    public void insertFirst(E element) {
        SLLNode<E> newNode = new SLLNode<>(element, first);

        first = newNode;

        // If the list was empty, the new node is also the last node.
        if (last == null) {
            last = newNode;
        }

        size++;
    }

    /**
     * Inserts an element immediately after the specified node.
     *
     * <p>The specified node must belong to this list.
     *
     * @param element element to insert
     * @param node    existing node after which the element is inserted
     * @throws IllegalArgumentException if node is null or does not
     *                                  belong to this list
     *                                  <p>
     *                                  Time complexity: O(n) because node membership is validated.
     */
    public void insertAfter(E element, SLLNode<E> node) {
        checkNode(node);

        SLLNode<E> newNode = new SLLNode<>(element, node.getSucc());

        node.setSucc(newNode);

        // Update the last reference if insertion occurs after the tail.
        if (last == node) {
            last = newNode;
        }

        size++;
    }

    /**
     * Inserts an element immediately before the specified node.
     *
     * <p>The specified node must belong to this list.
     *
     * @param element element to insert
     * @param before  existing node before which the element is inserted
     * @throws IllegalArgumentException if before is null or does not
     *                                  belong to this list
     *                                  <p>
     *                                  Time complexity: O(n).
     */
    public void insertBefore(E element, SLLNode<E> before) {
        checkNode(before);

        // Inserting before the first node is equivalent to insertFirst.
        if (first == before) {
            insertFirst(element);
            return;
        }

        SLLNode<E> current = first;

        // Find the predecessor of the specified node.
        while (current.getSucc() != before) {
            current = current.getSucc();
        }

        SLLNode<E> newNode = new SLLNode<>(element, before);

        current.setSucc(newNode);

        size++;
    }

    /**
     * Inserts an element at the end of the list.
     *
     * @param element element to insert
     *                <p>
     *                Time complexity: O(1).
     */
    public void insertLast(E element) {
        SLLNode<E> newNode = new SLLNode<>(element, null);

        if (isEmpty()) {
            first = newNode;
        } else {
            last.setSucc(newNode);
        }

        last = newNode;
        size++;
    }

    /**
     * Removes and returns the first element.
     *
     * @return removed element
     * @throws NoSuchElementException if the list is empty
     *                                <p>
     *                                Time complexity: O(1).
     */
    public E deleteFirst() {
        if (isEmpty()) {
            throw new NoSuchElementException("Cannot delete from an empty list.");
        }

        SLLNode<E> removedNode = first;

        first = first.getSucc();

        // If the list becomes empty, both references must be null.
        if (first == null) {
            last = null;
        }

        size--;

        E removedElement = removedNode.getElement();

        // Detach the removed node from the list.
        removedNode.setSucc(null);

        return removedElement;
    }

    /**
     * Removes the specified node from the list.
     *
     * <p>The specified node must belong to this list.
     *
     * @param node node to remove
     * @return element stored in the removed node
     * @throws IllegalArgumentException if node is null or does not
     *                                  belong to this list
     *                                  <p>
     *                                  Time complexity: O(n).
     */
    public E delete(SLLNode<E> node) {
        checkNode(node);

        if (first == node) {
            return deleteFirst();
        }

        SLLNode<E> current = first;

        // Find the predecessor of the node being removed.
        while (current.getSucc() != node) {
            current = current.getSucc();
        }

        current.setSucc(node.getSucc());

        // Update the last reference if the last node is removed.
        if (last == node) {
            last = current;
        }

        size--;

        E removedElement = node.getElement();

        // Detach the removed node.
        node.setSucc(null);

        return removedElement;
    }

    /**
     * Returns the first node in the list.
     *
     * @return first node, or null if the list is empty
     * <p>
     * Time complexity: O(1).
     */
    public SLLNode<E> getFirst() {
        return first;
    }

    /**
     * Returns the last node in the list.
     *
     * @return last node, or null if the list is empty
     * <p>
     * Time complexity: O(1).
     */
    public SLLNode<E> getLast() {
        return last;
    }

    /**
     * Searches for the first occurrence of an element.
     *
     * <p>Uses Objects.equals() to support null elements.
     *
     * @param element element to search for
     * @return matching node, or null if the element is not found
     * <p>
     * Time complexity: O(n).
     */
    public SLLNode<E> find(E element) {
        SLLNode<E> current = first;

        while (current != null) {
            if (Objects.equals(current.getElement(), element)) {
                return current;
            }

            current = current.getSucc();
        }

        return null;
    }

    /**
     * Appends all nodes from another singly linked list.
     *
     * <p>This is a destructive merge: ownership of the nodes is
     * transferred from the source list to this list.
     * After a successful merge, the source list becomes empty.
     *
     * <p>Both lists must be independent and must not share nodes.
     *
     * @param other source list whose nodes will be appended
     * @throws IllegalArgumentException if other is null, is this list,
     *                                  or shares nodes with this list
     *                                  <p>
     *                                  Time complexity: O(n) for checking shared nodes using tail
     *                                  references, otherwise O(1) for the merge itself.
     */
    public void merge(SLL<E> other) {
        if (other == null) {
            throw new IllegalArgumentException("Source list cannot be null.");
        }

        if (other == this) {
            throw new IllegalArgumentException("Cannot merge a list with itself.");
        }

        if (other.isEmpty()) {
            return;
        }

        // Two acyclic singly linked lists share nodes if and only if
        // their last nodes are identical.
        if (last != null && last == other.last) {
            throw new IllegalArgumentException("Cannot merge lists that share nodes.");
        }

        if (isEmpty()) {
            first = other.first;
            last = other.last;
        } else {
            last.setSucc(other.first);
            last = other.last;
        }

        size += other.size;

        // Transfer ownership: the source list becomes empty.
        other.first = null;
        other.last = null;
        other.size = 0;
    }

    /**
     * Reverses the order of the nodes in the list.
     *
     * <p>This operation changes node references without creating
     * additional nodes or copying elements.
     *
     * <p>After reversal, the former first node becomes the last node.
     * <p>
     * Time complexity: O(n).
     * Space complexity: O(1).
     */
    public void mirror() {
        SLLNode<E> previous = null;
        SLLNode<E> current = first;

        // The original first node becomes the new last node.
        last = first;

        while (current != null) {
            SLLNode<E> next = current.getSucc();

            // Reverse the direction of the current node's link.
            current.setSucc(previous);

            previous = current;
            current = next;
        }

        first = previous;
    }

    /**
     * Validates that the specified node belongs to this list.
     *
     * @param node node to validate
     * @throws IllegalArgumentException if node is null or not found
     */
    private void checkNode(SLLNode<E> node) {
        if (node == null) {
            throw new IllegalArgumentException("Node cannot be null.");
        }

        SLLNode<E> current = first;

        while (current != null) {
            if (current == node) {
                return;
            }

            current = current.getSucc();
        }

        throw new IllegalArgumentException("Node does not belong to this list.");
    }
}