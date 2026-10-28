package playground._01_arrays_and_lists;

import java.util.Objects;


public class DLL<E> {
    private DLLNode<E> first;
    private DLLNode<E> last;

    DLL() {
        first = null;
        last = null;
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
     * Да се вметне elem во дадена DLL на почеток:
     * 1. Направи го јазелот ins нов јазел со инфо elem и претходник и следбеник null.
     * 2. Постави следбеник на јазелот ins да биде first и first да биде ins.
     * 3. Нека succ е следбеникот на јазелот ins.
     * 4. Постави го претходникот на јазелот succ да биде ins.
     * 5. Заврши.
     *
     * Алгоритам:
     * insertFirst(E elem)
     *     ins = new DLLNode(elem)
     *     if first == null
     *         first = ins
     *         last = ins
     *         return
     *     ins.succ = first
     *     first.pred = ins
     *     first = ins
     */

    public void insertFirst(E elem) {
        DLLNode<E> ins = new DLLNode<>(elem);

        if (first == null) {
            first = ins;
            last = ins;
        } else {
            ins.succ = first;
            first.pred = ins;
            first = ins;
        }
    }


    /*
     * Да се вметне elem во дадена DLL на крај:
     * 1. Направи го јазелот ins нов јазел со инфо elem и претходник и следбеник null.
     * 2. Постави претходник на јазелот ins да биде last и last да биде ins
     * 3. Нека succ е претходникот на ins
     * 4. Постави следбеник на јазелот succ да биде ins
     * 5. Заврши.
     *
     * Алгоритам:
     * insertLast(E elem)
     *     ins = new DLLNode(elem)
     *     if last == null
     *         first = ins
     *         last = ins
     *         return
     *     ins.pred = last
     *     last.succ = ins
     *     last = ins
     */

    public void insertLast(E elem) {
        DLLNode<E> ins = new DLLNode<>(elem);

        if (last == null) {
            first = ins;
            last = ins;
        } else {
            last.succ = ins;
            ins.pred = last;
            last = ins;
        }
    }


    /*
     * Да се вметне elem во дадена DLL после јазол target:
     * 1. Направи го јазелот ins нов јазел со инфо elem и претходник и следбеник null.
     * 2. Постави претходник на јазелот ins да биде target
     * 3. Постави следбеник на ins да биде следбеникот на јазелот target
     * 3. Нека succ е следбеникот на ins
     * 4. Постави претходник на јазелот succ да биде ins, а следбеник на target да биде ins
     * 5. Заврши.
     *
     * Алгоритам:
     * insertAfter(E elem, DLLNode target)
     *     if target == null
     *         return
     *     ins = new DLLNode(elem)
     *     succ = target.succ
     *     ins.pred = target
     *     ins.succ = succ
     *     target.succ = ins
     *     if succ != null
     *         succ.pred = ins
     *     else
     *         last = ins
     */

    public void insertAfter(E elem, DLLNode<E> target) {
        if (target == null) {
            return;
        }

        DLLNode<E> ins = new DLLNode<>(elem);
        DLLNode<E> succ = target.succ;

        ins.pred = target;
        ins.succ = succ;
        target.succ = ins;

        if (succ != null) {
            succ.pred = ins;
        } else {
            last = ins;
        }
    }


    /*
     * Да се вметне elem во дадена DLL пред јазол target:
     * 1. Направи го јазелот ins нов јазел со инфо elem и претходник и следбеник null.
     * 2. Постави следбеник на ins да биде target.
     * 3. Постави претходник на ins да биде претходникот на target.
     * 4. Нека pred е претходникот на ins.
     * 5. Ако pred не е null, постави го неговиот следбеник да биде ins.
     * 6. Во спротивно, постави first да биде ins.
     * 7. Постави го претходникот на target да биде ins.
     * 8. Заврши.
     *
     * Алгоритам:
     * insertBefore(E elem, DLLNode target)
     *     if target == null
     *         return
     *     ins = new DLLNode(elem)
     *     pred = target.pred
     *     ins.pred = pred
     *     ins.succ = target
     *     if pred != null
     *         pred.succ = ins
     *     else
     *         first = ins
     *     target.pred = ins
     */

    public void insertBefore(E elem, DLLNode<E> target) {
        if (target == null) {
            return;
        }

        DLLNode<E> ins = new DLLNode<E>(elem);
        DLLNode<E> pred = target.pred;

        ins.pred = pred;
        ins.succ = target;
        target.pred = ins;

        if (pred != null) {
            pred.succ = ins;
        } else {
            first = ins;
        }
    }


    /*
     * Да се избрише јазел del од дадена DLL на почеток:
     * 1. Нека succ е следбеник на јазелот del.
     * 2. Го поставуваме first да покажува на јазелот succ.
     * 3. Поставуваме претходник на succ да биде null
     * 4. Заврши.
     *
     * Алгоритам:
     * deleteFirst()
     *     if first == null
     *         return null
     *     del = first
     *     succ = del.succ
     *     first = succ
     *     if succ != null
     *         succ.pred = null
     *     else
     *         last = null
     *     return del.elem
     **/

    public E deleteFirst() {
        if (first == null) {
            return null;
        }

        DLLNode<E> del = first;
        DLLNode<E> succ = first.succ;

        if (succ != null) {
            succ.pred = null;
        } else {
            last = null;
        }

        return del.elem;
    }


    /*
     * Да се избрише последниот јазел од дадена DLL:
     * 1. Ако листата е празна, заврши.
     * 2. Нека pred е претходникот на јазелот del.
     * 3. Постави го last да биде pred.
     * 4. Ако pred не е null, постави го неговиот следбеник да биде null.
     * 5. Во спротивно, постави first да биде null.
     * 6. Заврши.
     *
     * Алгоритам:
     * deleteLast()
     *     if last == null
     *         return null
     *     del = last
     *     pred = del.pred
     *     last = pred
     *     if pred != null
     *         pred.succ = null
     *     else
     *         first = null
     *     return del.elem
     **/

    public E deleteLast() {
        if (last == null) {
            return null;
        }

        DLLNode<E> del = last;
        DLLNode<E> pred = last.pred;

        if (pred != null) {
            pred.succ = null;
        } else {
            first = null;
        }

        return del.elem;
    }


    /*
     * (бришење на средишен јазел):
     *
     * Да се избрише произволен јазел del од DLL:
     * 1. Нека pred и succ се јазли кои означуваат претходник на
     *    јазелот del и следбеник на јазелот del соодветно.
     * 2. Постави го succ да биде следбеник на јазелот pred.
     * 3. Постави го pred да биде претходник на јазелот succ.
     * 4. Заврши.
     *
     * Алгоритам:
     * delete(DLLNode del)
     *     if del == null
     *         return null
     *     pred = del.pred
     *     succ = del.succ
     *     if pred != null
     *         pred.succ = succ
     *     else
     *         first = succ
     *     if succ != null
     *         succ.pred = pred
     *     else
     *         last = pred
     *     return del.elem
     **/

    public E delete(DLLNode<E> del) {
        if (del == null) {
            return null;
        }

        DLLNode<E> pred = del.pred;
        DLLNode<E> succ = del.succ;

        if (pred != null) {
            pred.succ = succ;
        } else {
            first = succ;
        }

        if (succ != null) {
            succ.pred = pred;
        } else {
            last = pred;
        }

        return del.elem;
    }


    /*
     * Да се избришат сите јазли од DLL:
     * 1. Постави first да биде null.
     * 2. Постави last да биде null.
     * 3. Постави size да биде 0, ако се чува бројот на јазли.
     * 4. Заврши.
     *
     * Алгоритам:
     * deleteList()
     *     first = null
     *     last = null
     *     size = 0
     */

    public void deleteList() {
        first = null;
        last = null;
    }


    /*
     * Да се пронајде јазолот што го содржи elem во DLL:
     * 1. Постави curr да биде first.
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

    public DLLNode<E> find(E elem) {
        DLLNode<E> curr = first;

        while (curr != null) {
            if (Objects.equals(curr.elem, elem)) {
                return curr;
            }
            curr = curr.succ;
        }

        return null;
    }


    /*
     * Да се добие првиот јазол во DLL:
     * 1. Врати го first.
     * 2. Заврши.
     *
     * Алгоритам:
     * getFirst()
     *     return first
     */

    public DLLNode<E> getFirst() {
        return first;
    }


    /*
     * Да се добие последниот јазол во DLL:
     * 1. Врати го last.
     * 2. Заврши.
     *
     * Алгоритам:
     * getLast()
     *     return last
     */

    public DLLNode<E> getLast() {
        return last;
    }


    /*
     * Да се добие бројот на јазли во DLL:
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
        DLLNode<E> curr = first;

        while (curr != null) {
            count++;
            curr = curr.succ;
        }

        return count;
    }


    /*
     * Да се спојат елементите од листата in на крајот на дадената DLL:
     * 1. Ако листата in е празна, заврши.
     * 2. Ако дадената DLL е празна, постави first и last да бидат првиот и
     *    последниот јазол од in.
     * 3. Во спротивно, поврзи го last од дадената DLL со first од in.
     * 4. Постави го last да биде last од in.
     * 5. Заврши.
     *
     * Алгоритам:
     * merge(DLL in)
     *     if in.first == null
     *         return
     *     if first == null
     *         first = in.first
     *         last = in.last
     *         return
     *     last.succ = in.first
     *     in.first.pred = last
     *     last = in.last
     */

    public void merge(DLL<E> in) {
        if (in.first == null) {
            return;
        }

        if (first == null) {
            first = in.first;
            last = in.last;
            return;
        }

        last.succ = in.first;
        in.first.pred = last;
        last = in.last;
    }


    /*
     * Да се претстават елементите на DLL како текст од првиот до последниот:
     * 1. Постави result да биде празен текст.
     * 2. Постави curr да биде first.
     * 3. Додека curr не е null:
     * 3.1. Додај го инфото на curr во result.
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
     *             result = result + " <-> "
     *         curr = curr.succ
     *     return result
     */

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder();

        DLLNode<E> curr = first;

        while (curr != null) {
            result.append(curr.elem);
            if (curr.succ != null) {
                result.append("<->");
            }
            curr = curr.succ;
        }

        return result.toString();
    }

    /*
     * Да се испечатат елементите на DLL од првиот до последниот:
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
        DLLNode<E> curr = first;

        while (curr != null) {
            System.out.println(curr.elem);
            curr = curr.succ;
        }
    }


    /*
     * Да се испечатат елементите на DLL од последниот до првиот:
     * 1. Постави curr да биде last.
     * 2. Додека curr не е null:
     * 2.1. Испечати го инфото на curr.
     * 2.2. Постави curr да биде неговиот претходник.
     * 3. Заврши.
     *
     * Алгоритам:
     * printLastToFirst()
     *     curr = last
     *     while curr != null
     *         print curr.elem
     *         curr = curr.pred
     */

    public void printLastToFirst() {
        DLLNode<E> curr = last;

        while (curr != null) {
            System.out.println(curr.elem);
            curr = curr.pred;
        }
    }
}