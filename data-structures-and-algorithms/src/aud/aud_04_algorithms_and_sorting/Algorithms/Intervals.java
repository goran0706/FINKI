package aud.aud_04_algorithms_and_sorting.Algorithms;

// ========================================
// Алчни алгоритми
// ========================================

// Задача 2)
// Дадени се N затворени интервали.
// Да се најдат сите интервали кои се преклопуваат и да се спојат.
// На крај излезот да содржи само дисјунктни интервали.

import java.util.ArrayList;
import java.util.List;

public class Intervals {

    static void main(String[] args) {
        List<Interval> intervals = new ArrayList<>(List.of(new Interval(1, 5), new Interval(3, 7), new Interval(8, 10), new Interval(9, 12), new Interval(15, 18), new Interval(18, 20)));

        System.out.println("Original intervals:");
        System.out.println(intervals);

        // Step 1: Sort intervals by their starting points.
        selectionSort(intervals);

        System.out.println("\nSorted intervals:");
        System.out.println(intervals);

        // Step 2: Merge all overlapping intervals.
        List<Interval> merged = mergeIntervals(intervals);

        System.out.println("\nMerged intervals:");
        System.out.println(merged);
    }

    // Selection Sort: Sort intervals by starting point in ascending order.
    public static void selectionSort(List<Interval> intervals) {
        for (int i = 0; i < intervals.size() - 1; i++) {
            int minIndex = i;

            // Find the interval with the smallest starting point.
            for (int j = i + 1; j < intervals.size(); j++) {
                if (intervals.get(j).start() < intervals.get(minIndex).start()) {
                    minIndex = j;
                }
            }

            // Move the smallest interval to its correct position.
            Interval temp = intervals.get(i);
            intervals.set(i, intervals.get(minIndex));
            intervals.set(minIndex, temp);
        }
    }

    // Greedy: Merge overlapping intervals into disjoint intervals.
    public static List<Interval> mergeIntervals(List<Interval> intervals) {
        List<Interval> merged = new ArrayList<>();

        if (intervals.isEmpty()) {
            return merged;
        }

        // Start with the first interval.
        Interval current = intervals.get(0);

        for (int i = 1; i < intervals.size(); i++) {
            Interval next = intervals.get(i);

            // Closed intervals overlap when the next start is <= current end.
            if (next.start() <= current.end()) {
                // Extend the current interval to include the overlapping interval.
                current = new Interval(current.start(), Math.max(current.end(), next.end()));
            } else {
                // No overlap: save the current interval and start a new one.
                merged.add(current);
                current = next;
            }
        }

        // Add the last merged interval.
        merged.add(current);

        return merged;
    }

    record Interval(int start, int end) {
        @Override
        public String toString() {
            return "[" + start + ", " + end + "]";
        }
    }
}