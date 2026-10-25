package aud.exe_01_arrays;

import java.util.Objects;

public class Array<E> {

    private Object[] data;
    private int size;

    public Array(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("Capacity cannot be negative");
        }

        this.data = new Object[capacity];
        this.size = 0;
    }

    public void insertLast(E element) {
        ensureCapacity();
        data[size++] = element;
    }

    public void insert(int index, E element) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Invalid index: " + index);
        }

        ensureCapacity();

        System.arraycopy(data, index, data, index + 1, size - index);

        data[index] = element;
        size++;
    }

    public void delete(int index) {
        checkElementIndex(index);

        int elementsToMove = size - index - 1;

        if (elementsToMove > 0) {
            System.arraycopy(data, index + 1, data, index, elementsToMove);
        }

        data[--size] = null;
    }

    public E get(int index) {
        checkElementIndex(index);
        @SuppressWarnings("unchecked") E element = (E) data[index];
        return element;
    }

    public void set(int index, E element) {
        checkElementIndex(index);
        data[index] = element;
    }

    public int find(E element) {
        for (int i = 0; i < size; i++) {
            if (Objects.equals(data[i], element)) {
                return i;
            }
        }

        return -1;
    }

    public int getSize() {
        return size;
    }

    public int getCapacity() {
        return data.length;
    }

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder("[ ");

        for (int i = 0; i < size; i++) {
            if (i > 0) {
                result.append(", ");
            }

            result.append(data[i]);
        }

        result.append(" ]");
        return result.toString();
    }

    // HELPERS

    private void resize(int capacity) {
        Object[] newData = new Object[capacity];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData;
    }

    private void ensureCapacity() {
        if (size == data.length) {
            int newCapacity = data.length == 0 ? 1 : data.length * 2;
            resize(newCapacity);
        }
    }

    private void checkElementIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Invalid index: " + index);
        }
    }
}
