package playground.низи_и_листи;

public class DLLNode<E> {
    protected E elem;
    protected DLLNode<E> pred;
    protected DLLNode<E> succ;

    DLLNode(E o) {
        this.elem = o;
        this.pred = null;
        this.succ = null;
    }

    DLLNode(E o, DLLNode<E> pred, DLLNode<E> succ) {
        this.elem = o;
        this.pred = pred;
        this.succ = succ;
    }
}
