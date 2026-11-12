package impl.Array;

import java.util.Arrays;
import java.util.Objects;

/**
 * A generic dynamic array implementation.
 *
 * <p>A dynamic array stores elements in a contiguous backing array.
 * When its capacity is exhausted, the backing array grows automatically.
 *
 * <p>Null elements are permitted.
 *
 * <p>Time complexity:
 * <ul>
 *     <li>Access by index: O(1)</li>
 *     <li>Update by index: O(1)</li>
 *     <li>Search: O(n)</li>
 *     <li>Insert at the end: O(1) amortized, O(n) worst case</li>
 *     <li>Insert at an arbitrary position: O(n)</li>
 *     <li>Delete at an arbitrary position: O(n)</li>
 * </ul>
 *
 * <p>Space complexity: O(n), where n is the number of elements.
 *
 * @param <E> the type of elements stored in this array
 */
public class Array<E> {

    /**
     * Maximum supported backing-array capacity.
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * Internal storage for array elements.
     *
     * <p>Java does not allow direct creation of generic arrays.
     * Therefore, an Object array is created and safely cast to E[].
     */
    private E[] data;

    /**
     * Number of elements currently stored in the array.
     *
     * <p>Always satisfies:
     * 0 <= size <= data.length
     */
    private int size;

    /**
     * Creates an empty dynamic array with the specified initial capacity.
     *
     * @param capacity initial backing-array capacity
     * @throws IllegalArgumentException if capacity is negative
     */
    @SuppressWarnings("unchecked")
    public Array(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("Capacity cannot be negative: " + capacity);
        }

        this.data = (E[]) new Object[capacity];
        this.size = 0;
    }

    /**
     * Inserts an element at the end of the array.
     *
     * <p>If the backing array is full, its capacity is increased
     * automatically before insertion.
     *
     * @param element element to insert
     * @throws OutOfMemoryError if the array cannot grow further
     *                          <p>
     *                          Time complexity: O(1) amortized, O(n) worst case.
     */
    public void insertLast(E element) {
        ensureCapacity(size + 1);

        data[size] = element;
        size++;
    }

    /**
     * Inserts an element at the specified position.
     *
     * <p>Existing elements at the specified position and after it
     * are shifted one position to the right.
     *
     * @param position insertion index, from 0 to size (inclusive)
     * @param element  element to insert
     * @throws IndexOutOfBoundsException if position is invalid
     *                                   <p>
     *                                   Time complexity: O(n).
     */
    public void insert(int position, E element) {
        checkPositionForInsertion(position);

        ensureCapacity(size + 1);

        // Shift existing elements one position to the right.
        System.arraycopy(data, position, data, position + 1, size - position);

        data[position] = element;
        size++;
    }

    /**
     * Replaces the element at the specified position.
     *
     * @param position index of the element to replace
     * @param element  new element
     * @throws IndexOutOfBoundsException if position is invalid
     *                                   <p>
     *                                   Time complexity: O(1).
     */
    public void set(int position, E element) {
        checkElementIndex(position);

        data[position] = element;
    }

    /**
     * Returns the element at the specified position.
     *
     * @param position index of the requested element
     * @return element stored at the specified position
     * @throws IndexOutOfBoundsException if position is invalid
     *                                   <p>
     *                                   Time complexity: O(1).
     */
    public E get(int position) {
        checkElementIndex(position);

        return data[position];
    }

    /**
     * Searches for the first occurrence of the specified element.
     *
     * <p>Null elements are supported and compared using
     * {@link Objects#equals(Object, Object)}.
     *
     * @param element element to search for
     * @return index of the first occurrence, or -1 if not found
     * <p>
     * Time complexity: O(n).
     */
    public int find(E element) {
        for (int i = 0; i < size; i++) {
            if (Objects.equals(data[i], element)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Returns the number of elements currently stored.
     *
     * @return number of elements
     * <p>
     * Time complexity: O(1).
     */
    public int getSize() {
        return size;
    }

    /**
     * Returns the current backing-array capacity.
     *
     * @return allocated capacity
     * <p>
     * Time complexity: O(1).
     */
    public int getCapacity() {
        return data.length;
    }

    /**
     * Checks whether the array contains no elements.
     *
     * @return true if the array is empty
     * <p>
     * Time complexity: O(1).
     */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Removes the element at the specified position.
     *
     * <p>Elements following the removed element are shifted
     * one position to the left.
     *
     * <p>The backing-array capacity is not reduced automatically.
     * This avoids unnecessary allocations during repeated deletions.
     *
     * @param position index of the element to remove
     * @throws IndexOutOfBoundsException if position is invalid
     *                                   <p>
     *                                   Time complexity: O(n).
     */
    public void delete(int position) {
        checkElementIndex(position);

        // Calculate how many elements must be shifted.
        int elementsToMove = size - position - 1;

        if (elementsToMove > 0) {
            System.arraycopy(data, position + 1, data, position, elementsToMove);
        }

        // Remove the obsolete reference to allow garbage collection.
        data[--size] = null;
    }

    /**
     * Increases the backing-array capacity.
     *
     * <p>The new capacity is twice the current capacity.
     * If the current capacity is zero, it grows to one.
     *
     * <p>This method explicitly increases capacity even if
     * unused capacity is already available.
     *
     * @throws OutOfMemoryError if the array cannot grow further
     *                          <p>
     *                          Time complexity: O(n).
     */
    public void resize() {
        int oldCapacity = data.length;

        if (oldCapacity >= MAX_ARRAY_SIZE) {
            throw new OutOfMemoryError("Maximum array capacity reached.");
        }

        int newCapacity = oldCapacity == 0 ? 1 : oldCapacity > MAX_ARRAY_SIZE / 2 ? MAX_ARRAY_SIZE : oldCapacity * 2;

        data = Arrays.copyOf(data, newCapacity);
    }

    /**
     * Ensures that the backing array has enough capacity.
     *
     * @param minCapacity minimum required capacity
     *                    <p>
     *                    Time complexity: O(n) when resizing is necessary,
     *                    O(1) otherwise.
     */
    private void ensureCapacity(int minCapacity) {
        if (minCapacity > data.length) {
            resize();
        }
    }

    /**
     * Validates an index used to access an existing element.
     *
     * @param position index to validate
     * @throws IndexOutOfBoundsException if index is outside [0, size)
     */
    private void checkElementIndex(int position) {
        if (position < 0 || position >= size) {
            throw new IndexOutOfBoundsException("Index: " + position + ", Size: " + size);
        }
    }

    /**
     * Validates an index used for insertion.
     *
     * <p>Insertion permits position == size because this represents
     * insertion at the end of the array.
     *
     * @param position insertion index to validate
     * @throws IndexOutOfBoundsException if index is outside [0, size]
     */
    private void checkPositionForInsertion(int position) {
        if (position < 0 || position > size) {
            throw new IndexOutOfBoundsException("Index: " + position + ", Size: " + size);
        }
    }

    /**
     * Returns a string representation of the array.
     *
     * <p>Elements are separated by commas and enclosed in braces.
     * An empty array is represented by {}.
     *
     * @return string representation of the array
     * <p>
     * Time complexity: O(n).
     */
    @Override
    public String toString() {
        return Arrays.toString(Arrays.copyOf(data, size)).replace('[', '{').replace(']', '}');
    }
}