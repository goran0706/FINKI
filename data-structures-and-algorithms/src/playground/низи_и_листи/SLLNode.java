package playground.низи_и_листи;

public class SLLNode<E> {
    protected E elem;
    protected SLLNode<E> succ;

    // Creates a node with the given element and no successor.
    public SLLNode(E element) {
        this.elem = element;
        this.succ = null;
    }

    // Creates a node with the given element and successor.
    public SLLNode(E element, SLLNode<E> node) {
        this.elem = element;
        this.succ = node;
    }
}