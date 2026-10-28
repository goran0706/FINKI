package playground.exercises.midterm_1;




/*
    Петар прави трик со карти. Тој има шпил од 51-на карта (некој некогаш не му вратил една) од којшто ви дозволува да влечете карта. Тој, за трикот да биде веродостоен, не ја знае картата, но знае на која позиција се наоѓа. Мааната на Петар е тоа што тој не знае регуларно да измеша карти, туку ги зема првите седум карти, им им го превртува редоследот (пр. од 1 2 3 4 5 6 7 ги реди во 7 6 5 4 3 2 1), потоа зема една карта од превртените и една од врвот од шпилот и го става на крајот од шпилот, така се додека не ги потроши сите седум карти. Со тоа остварува едно мешање на шпил.

    Ваша задача е, да изработите симулцаија на ваквото мешање, такашто за дадена N-та карта т.ш. 1<=N<=51, вие ќе му изброите колку вакви мешања треба тој да направи за на врв на шпилот да дојде извлечената карта.

    /

    Peter is doing a cards trick. He has a deck of 51 cards (someone didn't return him one in the past), from which he lets you draw one card. So that the trick is trustworthy, he doesn't know the card, but he knows on which position it is. Peter's fault is that he doesn't know how to regularly shuffle a deck of cards, but he firstly takes the first seven cards, reverses their order (e.g. from 1 2 3 4 5 6 7 he arranges them to 7 6 5 4 3 2 1), then he takes one card from the reversed ones, from the top of the deck, and he puts them at the end of the deck, until he does that for all the seven cards. With that he completes one deck shuffle.

    Your task is to make a simulation of this type of shuffling, so that for a given N-th card (1<=N<=51), you will count the numbers of this shuffles Peter needs to do so that the drawn card will come to the top of the deck.

    For example:
    Input 	Result

    15

    1
*/

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;


public class card_trick {
    public static int count(int N){
        // Vasiot kod tuka

    }

    public static void main(String[] args) throws NumberFormatException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in) );
        System.out.println(count(Integer.parseInt(br.readLine())));
    }

}


public class Exe5 {
}
