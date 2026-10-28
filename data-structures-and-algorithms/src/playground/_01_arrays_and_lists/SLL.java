package playground._01_arrays_and_lists;


public class SLL<E> {
    private SLLNode<E> first;

    SLL() {
        this.first = null;
    }


    /*
     * Сложеност на операциите кај несортирани листи
     *
     * +---------------------------+----------------+----------------+
     * | Операција                 | Несортирана SLL| Несортирана DLL|
     * +---------------------------+----------------+----------------+
     * | Пребарување               |     O(n)       |     O(n)       |
     * | Додавање на почеток       |     O(1)       |     O(1)       |
     * | Додавање на крај          |     O(n)*      |     O(1)       |
     * | Додавање на точна позиција|     O(1)       |     O(1)       |
     * | Бришење даден јазел       |     O(n)*      |     O(1)       |
     * | Претходник                |     O(n)       |     O(1)       |
     * | Следбеник                 |     O(1)       |     O(1)       |
     * | Минимум                   |     O(n)       |     O(n)       |
     * | Максимум                  |     O(n)       |     O(n)       |
     * +---------------------------+----------------+----------------+
     *
     * * SLL: Додавање на крај е O(n) без покажувач tail.
     *   Бришење даден јазел е O(n) без директен пристап до претходникот.
     */


    /*
     * Да се вметне elem во дадената SLL на почеток:
     * 1. Направи го јазолот ins нов јазол со инфо elem и следбеник null.
     * 2. Постави следбеник на јазолот ins да биде first.
     * 3. Постави го first да биде ins.
     * 4. Заврши.
     *
     * Алгоритам:
     * insertFirst(E elem)
     *     ins = new SLLNode(elem)
     *     ins.succ = first
     *     first = ins
     */

    public void insertFirst(E elem) {
        SLLNode<E> ins = new SLLNode<>(elem);
        ins.succ = first;
        first = ins;
    }


    /*
     * Да се вметне elem во дадената SLL на крај:
     * 1. Направи го јазолот ins нов јазол со инфо elem и следбеник null.
     * 2. Ако листата е празна, постави го first да биде ins.
     * 3. Во спротивно, најди го последниот јазол last.
     * 4. Постави го следбеникот на last да биде ins.
     * 5. Заврши.
     *
     * Алгоритам:
     * insertLast(E elem)
     *     ins = new SLLNode(elem)
     *     if first == null
     *         first = ins
     *         return
     *     last = first
     *     while last.succ != null
     *         last = last.succ
     *     last.succ = ins
     */

    public void insertLast(E elem) {
        SLLNode<E> ins = new SLLNode<E>(elem);

        if (first == null) {
            first = ins;
        } else {
            SLLNode<E> last = first;
            while (last.succ != null) {
                last = last.succ;
            }
            last.succ = ins;
        }
    }


    /*
     * Да се вметне elem во дадената SLL после јазолот pred:
     * 1. Направи го јазолот ins нов јазол со инфо elem и следбеник null.
     * 2. Постави го следбеникот на ins да биде следбеникот на pred.
     * 3. Постави го следбеникот на pred да биде ins.
     * 4. Заврши.
     *
     * Алгоритам:
     * insertAfter(E elem, SLLNode pred)
     *     if pred == null
     *         return
     *     ins = new SLLNode(elem)
     *     ins.succ = pred.succ
     *     pred.succ = ins
     */

    public void insertAfter(E elem, SLLNode<E> pred) {
        if (pred == null) {
            return;
        }
        SLLNode<E> ins = new SLLNode<E>(elem);
        ins.succ = pred.succ;
        pred.succ = ins;
    }


    /*
     * Да се вметне elem пред дадениот јазол before:
     * 1. Ако before е first, вметни elem на почетокот на листата.
     * 2. Во спротивно, најди го јазолот pred чиј следбеник е before.
     * 3. Ако pred не постои, заврши.
     * 4. Направи го јазолот ins нов јазол со инфо elem.
     * 5. Постави го следбеникот на ins да биде before.
     * 6. Постави го следбеникот на pred да биде ins.
     * 7. Заврши.
     *
     * Алгоритам:
     * insertBefore(E elem, SLLNode before)
     *     if before == null
     *         return
     *     if before == first
     *         insertFirst(elem)
     *         return
     *     pred = first
     *     while pred != null AND pred.succ != before
     *         pred = pred.succ
     *     if pred == null
     *         return
     *     ins = new SLLNode(elem)
     *     ins.succ = before
     *     pred.succ = ins
     */

    public void insertBefore(E elem, SLLNode<E> before) {
        if (before == null) {
            return;
        }

        if (before == first) {
            insertFirst(elem);
            return;
        }

        SLLNode<E> pred = first;

        while (pred != null && pred.succ != before) {
            pred = pred.succ;
        }

        if (pred == null) {
            return;
        }

        pred.succ = new SLLNode<>(elem, before);
    }


    /*
     * Да се избрише првиот јазол во дадената SLL:
     * 1. Ако листата е празна, заврши.
     * 2. Нека succ е следбеникот на првиот јазол.
     * 3. Постави го first да биде succ.
     * 4. Заврши.
     *
     * Алгоритам:
     * deleteFirst()
     *     if first == null
     *         return null
     *     del = first
     *     first = first.succ
     *     return del.elem
     */

    public E deleteFirst() {
        if (first == null) {
            return null;
        }

        SLLNode<E> del = first;
        first = first.succ;
        return del.elem;
    }


    /*
     * Да се избрише даден јазол del од SLL:
     * 1. Ако листата е празна или del е null, заврши.
     * 2. Ако del е first, избриши го првиот јазол.
     * 3. Во спротивно, најди го јазолот pred чиј следбеник е del.
     * 4. Ако pred не постои, заврши.
     * 5. Нека succ е следбеникот на del.
     * 6. Постави го следбеникот на pred да биде succ.
     * 7. Заврши.
     *
     * Алгоритам:
     * delete(SLLNode del)
     *     if first == null OR del == null
     *         return null
     *     if del == first
     *         return deleteFirst()
     *     pred = first
     *     while pred != null AND pred.succ != del
     *         pred = pred.succ
     *     if pred == null
     *         return null
     *     pred.succ = del.succ
     *     return del.elem
     */

    public E delete(SLLNode<E> del) {
        if (first == null || del == null) {
            return null;
        }

        if (del == first) {
            return deleteFirst();
        }

        SLLNode<E> pred = first;

        while (pred != null && pred.succ != del) {
            pred = pred.succ;
        }

        if (pred == null) {
            return null;
        }

        pred.succ = del.succ;
        return del.elem;
    }


    /*
     * Да се пронајде јазолот што го содржи elem во SLL:
     * 1. Постави го тековниот јазол curr да биде first.
     * 2. Додека curr не е null:
     * 2.1. Ако инфото на curr е elem, врати го curr.
     * 2.2. Постави curr да биде неговиот следбеник.
     * 3. Ако елементот не постои, врати null.
     * 4. Заврши.
     *
     * Алгоритам:
     * find(E elem)
     *     curr = first
     *     while curr != null
     *         if curr.elem equals elem
     *             return curr
     *         curr = curr.succ
     *     return null
     */

    public SLLNode<E> find(E elem) {
        SLLNode<E> curr = first;

        while (curr != null) {
            if (curr.elem == elem) {
                return curr;
            }
            curr = curr.succ;
        }

        return null;
    }


    /*
     * Да се добие првиот јазол во SLL:
     * 1. Врати го first.
     * 2. Заврши.
     *
     * Алгоритам:
     * getFirst()
     *     return first
     */

    public SLLNode<E> getFirst() {
        return first;
    }


    /*
     * Да се добие бројот на јазли во SLL:
     * 1. Постави count = 0.
     * 2. Постави curr да биде first.
     * 3. Додека curr не е null:
     * 3.1. Зголеми count за 1.
     * 3.2. Постави curr да биде неговиот следбеник.
     * 4. Врати count.
     * 5. Заврши.
     *
     * Алгоритам:
     * getSize()
     *     count = 0
     *     curr = first
     *     while curr != null
     *         count = count + 1
     *         curr = curr.succ
     *     return count
     */

    public int getSize() {
        int count = 0;
        SLLNode<E> curr = first;

        while (curr != null) {
            count++;
            curr = curr.succ;
        }

        return count;
    }


    /*
     * Да се спојат елементите од листата in на крајот на дадената SLL:
     * 1. Ако листата in е празна, заврши.
     * 2. Ако дадената SLL е празна, постави го first да биде first од in.
     * 3. Во спротивно, најди го последниот јазол last од дадената SLL.
     * 4. Постави го следбеникот на last да биде first од in.
     * 5. Заврши.
     *
     * Алгоритам:
     * merge(SLL in)
     *     if in.first == null
     *         return
     *     if first == null
     *         first = in.first
     *         return
     *     last = first
     *     while last.succ != null
     *         last = last.succ
     *     last.succ = in.first
     */

    public void merge(SLL<E> in) {
        if (in.first == null) {
            return;
        }

        if (first == null) {
            first = in.first;
            return;
        }

        SLLNode<E> last = first;

        while (last.succ != null) {
            last = last.succ;
        }

        last.succ = in.first;
    }


    /*
     * Да се претстават елементите на SLL како текст:
     * 1. Постави result да биде празен текст.
     * 2. Постави curr да биде first.
     * 3. Додека curr не е null:
     * 3.1. Додај го елементот на curr во result.
     * 3.2. Ако curr има следбеник, додај разделувач.
     * 3.3. Постави curr да биде неговиот следбеник.
     * 4. Врати result.
     * 5. Заврши.
     *
     * Алгоритам:
     * toString()
     *     result = ""
     *     curr = first
     *     while curr != null
     *         result = result + curr.elem
     *         if curr.succ != null
     *             result = result + "->"
     *         curr = curr.succ
     *     return result
     */

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder();

        SLLNode<E> curr = first;

        while (curr != null) {
            result.append(curr.elem);

            if (curr.succ != null) {
                result.append("->");
            }

            curr = curr.succ;
        }

        return result.toString();
    }


    /*
     * Да се испечатат елементите на SLL од првиот до последниот:
     * 1. Постави curr да биде first.
     * 2. Додека curr не е null:
     * 2.1. Испечати го инфото на curr.
     * 2.2. Постави curr да биде неговиот следбеник.
     * 3. Заврши.
     *
     * Алгоритам:
     * printFirstToLast()
     *     curr = first
     *     while curr != null
     *         print curr.elem
     *         curr = curr.succ
     */

    public void printFirstToLast() {
        SLLNode<E> curr = first;

        while (curr != null) {
            System.out.println(curr.elem);
            curr = curr.succ;
        }
    }
}