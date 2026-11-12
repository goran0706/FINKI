package impl.DLL;

import java.util.NoSuchElementException;
import java.util.Objects;

/**
 * Generic doubly linked list implementation.
 *
 * <p>Each node maintains references to both its predecessor and successor.
 *
 * <p>The list maintains references to its first and last nodes.
 *
 * <p>Structural invariants:
 * <ul>
 *     <li>first == null if and only if last == null.</li>
 *     <li>size == 0 if and only if the list is empty.</li>
 *     <li>first.pred == null when the list is not empty.</li>
 *     <li>last.succ == null when the list is not empty.</li>
 *     <li>For every adjacent pair A and B:
 *         A.succ == B and B.pred == A.</li>
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
 *     <li>Insert after: O(n) including membership validation</li>
 *     <li>Insert before: O(n) including membership validation</li>
 *     <li>Delete first: O(1)</li>
 *     <li>Delete last: O(1)</li>
 *     <li>Delete node: O(n) including membership validation</li>
 *     <li>Find: O(n)</li>
 *     <li>Size: O(1)</li>
 *     <li>Mirror: O(n)</li>
 *     <li>Forward traversal: O(n)</li>
 *     <li>Backward traversal: O(n)</li>
 * </ul>
 *
 * <p>Space complexity: O(n).
 *
 * @param <E> type of elements stored in the list
 */
public class DLL<E> {

    /**
     * Reference to the first node.
     */
    private DLLNode<E> first;

    /**
     * Reference to the last node.
     */
    private DLLNode<E> last;

    /**
     * Number of elements stored in the list.
     */
    private int size;

    /**
     * Constructs an empty doubly linked list.
     */
    public DLL() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    /**
     * Inserts an element at the beginning of the list.
     *
     * @param element element to insert
     *                <p>
     *                Time complexity: O(1).
     */
    public void insertFirst(E element) {
        DLLNode<E> newNode = new DLLNode<>(element, null, first);

        if (isEmpty()) {
            last = newNode;
        } else {
            first.setPred(newNode);
        }

        first = newNode;
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
        DLLNode<E> newNode = new DLLNode<>(element, last, null);

        if (isEmpty()) {
            first = newNode;
        } else {
            last.setSucc(newNode);
        }

        last = newNode;
        size++;
    }

    /**
     * Inserts an element immediately after the specified node.
     *
     * <p>The specified node must belong to this list.
     *
     * @param element element to insert
     * @param after   existing node after which the element is inserted
     * @throws IllegalArgumentException if after is null or does not
     *                                  belong to this list
     *                                  <p>
     *                                  Time complexity: O(n) including membership validation.
     */
    public void insertAfter(E element, DLLNode<E> after) {
        checkNode(after);

        if (after == last) {
            insertLast(element);
            return;
        }

        DLLNode<E> successor = after.getSucc();

        DLLNode<E> newNode = new DLLNode<>(element, after, successor);

        after.setSucc(newNode);
        successor.setPred(newNode);

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
     *                                  Time complexity: O(n) including membership validation.
     */
    public void insertBefore(E element, DLLNode<E> before) {
        checkNode(before);

        if (before == first) {
            insertFirst(element);
            return;
        }

        DLLNode<E> predecessor = before.getPred();

        DLLNode<E> newNode = new DLLNode<>(element, predecessor, before);

        predecessor.setSucc(newNode);
        before.setPred(newNode);

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

        DLLNode<E> removedNode = first;

        first = removedNode.getSucc();

        if (first == null) {
            last = null;
        } else {
            first.setPred(null);
        }

        size--;

        E removedElement = removedNode.getElement();

        // Detach the removed node from the list.
        removedNode.setPred(null);
        removedNode.setSucc(null);

        return removedElement;
    }

    /**
     * Removes and returns the last element.
     *
     * @return removed element
     * @throws NoSuchElementException if the list is empty
     *                                <p>
     *                                Time complexity: O(1).
     */
    public E deleteLast() {
        if (isEmpty()) {
            throw new NoSuchElementException("Cannot delete from an empty list.");
        }

        DLLNode<E> removedNode = last;

        last = removedNode.getPred();

        if (last == null) {
            first = null;
        } else {
            last.setSucc(null);
        }

        size--;

        E removedElement = removedNode.getElement();

        // Detach the removed node from the list.
        removedNode.setPred(null);
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
     *                                  Time complexity: O(n) including membership validation.
     */
    public E delete(DLLNode<E> node) {
        checkNode(node);

        if (node == first) {
            return deleteFirst();
        }

        if (node == last) {
            return deleteLast();
        }

        DLLNode<E> predecessor = node.getPred();
        DLLNode<E> successor = node.getSucc();

        // Connect the predecessor directly to the successor.
        predecessor.setSucc(successor);
        successor.setPred(predecessor);

        size--;

        E removedElement = node.getElement();

        // Detach the removed node from the list.
        node.setPred(null);
        node.setSucc(null);

        return removedElement;
    }

    /**
     * Searches for the first occurrence of an element.
     *
     * <p>Uses Objects.equals() to support null elements.
     *
     * @param element element to search for
     * @return matching node, or null if not found
     * <p>
     * Time complexity: O(n).
     */
    public DLLNode<E> find(E element) {
        DLLNode<E> current = first;

        while (current != null) {
            if (Objects.equals(current.getElement(), element)) {
                return current;
            }

            current = current.getSucc();
        }

        return null;
    }

    /**
     * Removes all elements from the list.
     *
     * <p>All node references are detached before the list
     * becomes empty.
     * <p>
     * Time complexity: O(n).
     */
    public void deleteList() {
        DLLNode<E> current = first;

        while (current != null) {
            DLLNode<E> next = current.getSucc();

            current.setPred(null);
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
    public int getSize() {
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
     * Returns a string representation of the list
     * traversed from first to last.
     *
     * <p>Elements are separated by &lt;-&gt;.
     * An empty list is represented by "Prazna lista!!!".
     *
     * @return forward string representation
     * <p>
     * Time complexity: O(n).
     */
    @Override
    public String toString() {
        if (isEmpty()) {
            return "Prazna lista!!!";
        }

        StringBuilder result = new StringBuilder();

        DLLNode<E> current = first;

        while (current != null) {
            if (!result.isEmpty()) {
                result.append("<->");
            }

            result.append(current);
            current = current.getSucc();
        }

        return result.toString();
    }

    /**
     * Returns a string representation of the list
     * traversed from last to first.
     *
     * <p>Elements are separated by &lt;-&gt;.
     * An empty list is represented by "Prazna lista!!!".
     *
     * @return backward string representation
     * <p>
     * Time complexity: O(n).
     */
    public String toStringR() {
        if (isEmpty()) {
            return "Prazna lista!!!";
        }

        StringBuilder result = new StringBuilder();

        DLLNode<E> current = last;

        while (current != null) {
            if (!result.isEmpty()) {
                result.append("<->");
            }

            result.append(current);
            current = current.getPred();
        }

        return result.toString();
    }

    /**
     * Returns the first node.
     *
     * @return first node, or null if the list is empty
     * <p>
     * Time complexity: O(1).
     */
    public DLLNode<E> getFirst() {
        return first;
    }

    /**
     * Returns the last node.
     *
     * @return last node, or null if the list is empty
     * <p>
     * Time complexity: O(1).
     */
    public DLLNode<E> getLast() {
        return last;
    }


    // Да се напише функција (метод) кој ќе превртува зададена двојно поврзана листа.

    /**
     * Reverses the order of the nodes in the list.
     *
     * <p>Both predecessor and successor references are swapped
     * for every node.
     *
     * <p>No new nodes are created.
     * <p>
     * Time complexity: O(n).
     * Space complexity: O(1).
     */
    public void mirror() {
        DLLNode<E> current = first;

        while (current != null) {
            // Preserve the original successor before swapping links.
            DLLNode<E> next = current.getSucc();

            // Reverse both directions of the current node.
            current.setSucc(current.getPred());
            current.setPred(next);

            current = next;
        }

        // Swap the list boundaries.
        DLLNode<E> oldFirst = first;
        first = last;
        last = oldFirst;
    }

    /**
     * Validates that the specified node belongs to this list.
     *
     * <p>Node identity is checked using reference equality.
     *
     * @param node node to validate
     * @throws IllegalArgumentException if node is null or does not
     *                                  belong to this list
     *                                  <p>
     *                                  Time complexity: O(n).
     */
    private void checkNode(DLLNode<E> node) {
        if (node == null) {
            throw new IllegalArgumentException("Node cannot be null.");
        }

        DLLNode<E> current = first;

        while (current != null) {
            if (current == node) {
                return;
            }

            current = current.getSucc();
        }

        throw new IllegalArgumentException("Node does not belong to this list.");
    }
}