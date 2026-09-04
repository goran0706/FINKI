/* 
  * How to 'judge' an algorithm:
  - Stable or not
  - Time consumption
  - Memory space consumption

  * Time Complexity: total amount of work
  - number of comparisons and swaps
  - number of iterated elements
  - number of divides

  * Space Complexity: Not the size of the input data
  - number of variables created
  - number of frames in stack simultaneously

  * Big O Notation
  - In computer science, big 0 notation is used to classify algorithms according to how their running time or space requirements grow as the input size grows.
  - Used for making comparisons, not for accurately recording a number

  O(math expression with N) - n represents the size

  - O(1) - Constant growth, the complexity is unaffected by the input size
  - O(log n) - Logarithmic growth
  - O(n) - linear growth, the complexity grows by the same amount in each input size step 
  - O(n log n) - Loglinear growth
  - O(n^x): Polynomial complexity.
  - O(X^n): Exponential time.
  - O(n!): Factorial complexity.  
  - O(n^2) - quadratic growth, complexity grows faster and faster (e.g. bubble and cocktail sort)

  Time and Space Complexity List
  https://www.bigocheatsheet.com/
*/

{
  // Swap values without creating a new variable
  let a, b;

  a = 100;
  b = 200;

  a = a + b;
  b = a - b;
  a = a - b;
}

/* Count how many times each character of a string has been used */
/* Count words */
/* Find the most and least frequently used characters */
/* Find the most and least frequently used words */

// * Sorting Algorithms
// * Searching Algorithms

{
  /* 
    Bubble Sort 
  
    Bubble sorting is based on comparing and swapping neighboring elements.
    
    When to use Bubble Sort?
    1. If the length of the array is too small to worry about the performance issues: Bubble sort has a high time complexity, i.e., O(n^2^). 
    If the array is too small, this time, complexity will also come out to be considerably small. Hence, we can use bubble sort for smaller arrays

    2. If the array is almost sorted, i.e., the best case: Bubble sort's best-case time complexity is O(n), which is better than the best-case time 
    complexity of even the best sorting algorithms, like merge sort and quick sort, i.e., O(n*logn). 
    Hence, for almost sorted arrays, bubble sort is best suited.
  */

  // let arr = [8, 9, 5, 6, 1, 2, 4, 3, 7];
  let arr = [1, 2, 3, 4, 5];
  let end = arr.length - 1;
  let leftSortBorder = 0;

  for (let index = 0; index < end; index++) {
    let sorted = true;
    let lastExchangeIndex;

    // Last i elements are already in place
    for (let index = end; index > leftSortBorder; index--) {
      // Comparing two adjacent numbers
      // and see if first is greater than second
      if (arr[index] > arr[index - 1]) {
        // Swap them if the condition is true
        let tmp = arr[index];
        arr[index] = arr[index - 1];
        arr[index - 1] = tmp;
        sorted = false;
        lastExchangeIndex = index;
      }
      console.log(index, arr);
    }

    leftSortBorder = lastExchangeIndex;
    if (sorted) break;
  }
}

{
  /* 
    Cocktail Sort
    
    Cocktail sort combines the forward and backwards iteration. It iterates over the array in two altering directions. 
    It is better then guessing the sorting direction using the Bubble sort algorithm.
  */

  let arr = [4, 3, 2, 1, 5];
  //let arr = [1,5,4,3,2]
  console.log(arr);

  let end = arr.length - 1;
  let leftSortBorder = 0;
  let rightSortBorder = end;

  for (let index = 0; index < end; index++) {
    let sorted = true;
    let lastExchangeIndex;

    if (index % 2 == 0) {
      // odd loop: L->R
      for (let index = leftSortBorder; index < rightSortBorder; index++) {
        if (arr[index] < arr[index + 1]) {
          let tmp = arr[index];
          arr[index] = arr[index + 1];
          arr[index + 1] = tmp;
          sorted = false;
          lastExchangeIndex = index;
        }
        console.log('LR', arr);
      }
      rightSortBorder = lastExchangeIndex;
    } else {
      // even loop: R->L
      for (let index = rightSortBorder; index > leftSortBorder; index--) {
        if (arr[index] > arr[index - 1]) {
          let tmp = arr[index];
          arr[index] = arr[index - 1];
          arr[index - 1] = tmp;
          sorted = false;
          lastExchangeIndex = index;
        }
        console.log('RL', arr);
      }
      leftSortBorder = lastExchangeIndex;
    }

    if (sorted) break;
  }
}

{
  /* Quick Sort */

  //let arr = [3,0,5,6,2,1,4]
  let arr = [6, 5, 4, 3, 2, 1, 0];

  function quickSort(arr) {
    if (arr.length <= 1) return arr;

    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0];
    let leftSection = [];
    let rightSection = [];

    for (let index = 0; index < arr.length; index++) {
      arr[index] < pivot
        ? leftSection.push(arr[index])
        : rightSection.push(arr[index]);
    }

    return quickSort(leftSection).concat([pivot], quickSort(rightSection));
    // return [...quickSort(leftSection), pivot, ...quickSort(rightSection)];
  }

  console.log(quickSort(arr));
}

{
  /* 
    Counting Sort 

    - No comparison needed
    - Can only handle positive integers
    - Ideal for sorting small integers
    - Creative use of array indexes
    - Array indexes are a series of sorted and ascending integers
  */

  let unsorted = [114, 118, 106, 106, 110, 110, 114, 106, 118, 110, 116];

  let queue = [];
  let min = unsorted[0];

  unsorted.forEach((item) => {
    if (min > item) {
      min = item;
    }
  });

  unsorted.forEach((element) => {
    let proxy_element = element - min;
    if (queue[proxy_element] === undefined) {
      queue[proxy_element] = 1;
    } else {
      queue[proxy_element]++;
    }
  });

  let asc = [];
  let desc = [];

  for (let element = 0; element < queue.length; element++) {
    if (queue[element] !== undefined) {
      for (let counter = 1; counter <= queue[element]; counter++) {
        asc.push(element + min);
      }
    }
  }
  for (let element = queue.length - 1; element >= 0; element--) {
    if (queue[element] !== undefined) {
      for (let counter = 1; counter <= queue[element]; counter++) {
        desc.push(element + min);
      }
    }
  }
}

{
  /* Insertion Sort */
  let arr = [5, 2, 6, 0, 1, 3, 4];
  console.log(arr);

  function insertSort(arr) {
    let length = arr.length;

    for (let outer_c = 1; outer_c < length; outer_c++) {
      for (
        let inner_c = outer_c;
        inner_c > 0 && arr[inner_c] < arr[inner_c - 1];
        inner_c--
      ) {
        let tmp = arr[inner_c];
        arr[inner_c] = arr[inner_c - 1];
        arr[inner_c - 1] = tmp;
      }
      console.log(arr);
    }

    return arr;
  }

  let asc = insertSort(arr);
  console.log(asc);
}

{
  /* Bucket Sort */

  let unsorted = [5, 2, 6, 10, 11, 17, 4, 9, 8, 20, 15, 12, 16, 10];

  let max, min;
  max = min = unsorted[0];
  let length = unsorted.length;

  for (let i = 0; i < length; i++) {
    if (unsorted[i] > max) max = unsorted[i];
    if (unsorted[i] < min) min = unsorted[i];
  }

  let total = 6;
  let bucket_size = (max - min + 1) / total;
  let buckets = [];

  for (let i = 0; i < length; i++) {
    let bucket_id = Math.floor((unsorted[i] - min) / bucket_size);
    if (buckets[bucket_id]) {
      let bucket = buckets[bucket_id];
      let index = bucket.length - 1;
      while (bucket[index] > unsorted[i] && index >= 0) {
        bucket[index + 1] = bucket[index];
        index--;
      }
      bucket[index + 1] = unsorted[i];
    } else {
      // empty, create bucket first
      buckets[bucket_id] = [];
      buckets[bucket_id].push(unsorted[i]);
    }
  }

  let sorted = [];

  for (let i = 0; i < buckets.length; i++) {
    sorted = sorted.concat(buckets[i]);
  }
}

{
  /* Selection Sort */

  //let arr = [5,2,6,0,1,3,4]
  //let arr = [6,5,4,3,2,1,0]
  let arr = [0, 1, 2, 3, 4, 5, 6];
  let length = arr.length;

  for (let outer = 0; outer < length; outer++) {
    let minIndex = outer;
    for (inner = outer + 1; inner < length; inner++) {
      if (arr[minIndex] > arr[inner]) {
        minIndex = inner;
      }
    }
    if (outer != minIndex) {
      let tmp = arr[outer];
      arr[outer] = arr[minIndex];
      arr[minIndex] = tmp;
      console.log(tmp);
    }
  }
}

{
  /* Heap Sort */

  let unsorted = [10, 13, 11, 17, 14, 12, 15, 19, 18, 16];

  function makeMaxHeap(arr) {
    let maxHeap = [];
    let length = arr.length;
    for (let i = 0; i < length; i++) {
      maxHeap.push(arr[i]);
      let newNodeIndex = maxHeap.length - 1;
      while (newNodeIndex > 0) {
        if (
          maxHeap[Math.floor((newNodeIndex - 1) / 2)] < maxHeap[newNodeIndex]
        ) {
          let tmp = maxHeap[newNodeIndex];
          maxHeap[newNodeIndex] = maxHeap[Math.floor((newNodeIndex - 1) / 2)];
          maxHeap[Math.floor((newNodeIndex - 1) / 2)] = tmp;
          newNodeIndex = Math.floor((newNodeIndex - 1) / 2);
        } else {
          break;
        }
      }
    }
    return maxHeap;
  }

  function heapSort(arr) {
    let sorted = [];
    let maxHeap = makeMaxHeap(arr);
    while (maxHeap.length) {
      let max = maxHeap.shift();
      sorted.push(max);
      maxHeap = makeMaxHeap(maxHeap);
    }
    return sorted;
  }
}
