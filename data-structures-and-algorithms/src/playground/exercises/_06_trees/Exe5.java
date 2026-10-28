package playground.exercises._06_trees;

/*
Во следната задача треба да изградите бинарно дрво со N јазли, за кое ќе треба да одговорите на Q прашања од видот „која е сумата на степените во поддрвото на избран јазол“.

Секој јазол ќе има уникатно име. Името на коренот на дрвото секогаш ќе ви биде дадено прво.

Влезот ќе содржи N+Q редови од видот

    root ime - Треба да го поставите коренот на дрвото да биде јазелот со име ime

    add parent_name child_name - Треба да додадете дете јазел со име child_name на јазелот со име parent_name

    ask node_name - Треба да го одговориме прашањето за поддрвото на јазелот со име node_name

Пример и структура на влезот:

Влез


Објаснување


Излез
11 9
root bravo
add bravo echo LEFT
add echo beard LEFT
ask beard
ask bravo
add bravo foxtrot RIGHT
add beard hotel LEFT
add beard india RIGHT
ask echo
add foxtrot golf LEFT
add golf juliet RIGHT
add india sierra RIGHT
ask foxtrot
ask bravo
ask beard
add echo mike RIGHT
add foxtrot tango RIGHT
ask echo
ask bravo
ask foxtrot

Прикажано е изгледот на дрвото при секоја од 4те групи прашања во влезот





0
2
3
2
8
3
5
10
3



For example:
Input 	Result

11 9
root bravo
add bravo echo LEFT
add echo beard LEFT
ask beard
ask bravo
add bravo foxtrot RIGHT
add beard hotel LEFT
add beard india RIGHT
ask echo
add foxtrot golf LEFT
add golf juliet RIGHT
add india sierra RIGHT
ask foxtrot
ask bravo
ask beard
add echo mike RIGHT
add foxtrot tango RIGHT
ask echo
ask bravo
ask foxtrot



0
2
3
2
8
3
5
10
3

* */
public class Exe5 {
}
