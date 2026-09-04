# C++ Review Questions

## C++ Essentials

1. What are the modules of C++ programs called?

2. What does the following preprocessor directive do?
   ```cpp
   #include <iostream>
   ```

3. What does the following statement do?
   ```cpp
   using namespace std;
   ```

4. What statement would you use to print the phrase "Hello, world" and then start a new line?

5. What statement would you use to create an integer variable with the name `cheeses`?

6. What statement would you use to assign the value 32 to the variable `cheeses`?

7. What statement would you use to read a value from keyboard input into the variable `cheeses`?

8. What statement would you use to print "We have X varieties of cheese," where the current value of the `cheeses`
   variable replaces X?

9. What do the following function prototypes tell you about the functions?
   ```cpp
   int froop(double t);
   void rattle(int n);
   int prune(void);
   ```

10. When do you not have to use the keyword `return` when you define a function?

11. Suppose your `main()` function has the following line:
    ```cpp
    cout << "Please enter your PIN: ";
    ```
    And suppose the compiler complains that `cout` is an unknown identifier. What is the likely cause of this complaint,
    and what are three ways to fix the problem?

---

## Fundamental Types

1. Why does C++ have more than one integer type?

2. Declare variables matching the following descriptions:
   a. A short integer with the value 80
   b. An unsigned int integer with the value 42,110
   c. An integer with the value 3,000,000,000

3. What safeguards does C++ provide to keep you from exceeding the limits of an integer type?

4. What is the distinction between `33L` and `33`?

5. Consider the two C++ statements that follow:
   ```cpp
   char grade = 65;
   char grade = 'A';
   ```
   Are they equivalent?

6. How could you use C++ to find out which character the code 88 represents? Come up with at least two ways.

7. Assigning a `long` value to a `float` can result in a rounding error. What about assigning `long` to `double`?
   `long long` to `double`?

8. Evaluate the following expressions as C++ would:
   a. `8 * 9 + 2`
   b. `6 * 3 / 4`
   c. `3 / 4 * 6`
   d. `6.0 * 3 / 4`
   e. `15 % 4`

9. Suppose `x1` and `x2` are two type `double` variables that you want to add as integers and assign to an integer
   variable. Construct a C++ statement for doing so. What if you want to add them as type `double` and then convert to
   `int`?

10. What is the variable type for each of the following declarations?
    a. `auto cars = 15;`
    b. `auto iou = 150.37f;`
    c. `auto level = 'B';`
    d. `auto crat = U'\U00002155';`
    e. `auto fract = 8.25f/2.5;`

---

## Compound Types

1. How would you declare each of the following?
   a. `actors` is an array of 30 `char`.
   b. `betsie` is an array of 100 `short`.
   c. `chuck` is an array of 13 `float`.
   d. `dipsea` is an array of 64 `long double`.

2. Does Chapter Review Question 1 use the array template class instead of built-in arrays.

3. Declare an array of five `int`s and initialize it to the first five odd positive integers.

4. Write a statement that assigns the sum of the first and last elements of the array in Question 3 to the variable
   `even`.

5. Write a statement that displays the value of the second element in the `float` array `ideas`.

6. Declare an array of `char` and initialize it to the string `"cheeseburger"`.

7. Declare a `string` object and initialize it to the string `"Waldorf Salad"`.

8. Devise a structure declaration that describes a fish. The structure should include the kind, the weight in whole
   ounces, and the length in fractional inches.

9. Declare a variable of the type defined in Question 8 and initialize it.

10. Use `enum` to define a type called `Response` with the possible values `Yes`, `No`, and `Maybe`. `Yes` should be 1,
    `No` should be 0, and `Maybe` should be 2.

11. Suppose `ted` is a `double` variable. Declare a pointer that points to `ted` and use the pointer to display `ted`'s
    value.

12. Suppose `treacle` is an array of 10 `float`s. Declare a pointer that points to the first element of `treacle` and
    use the pointer to display the first and last elements of the array.

13. Write a code fragment that asks the user to enter a positive integer and then creates a dynamic array of that many
    `int`s. Do this by using `new`, then again using a `vector` object.

14. Is the following valid code? If so, what does it print?
    ```cpp
    cout << (int *) "Home of the jolly bytes";
    ```

15. Write a code fragment that dynamically allocates a structure of the type described in Question 8 and then reads a
    value for the `kind` member of the structure.

16. Listing 4.6 illustrates a problem created by following numeric input with line-oriented string input. How would
    replacing this:
    ```cpp
    cin.getline(address, 80);
    ```
    with this:
    ```cpp
    cin >> address;
    ```
    affect the working of this program?

17. Declare a `vector` object of 10 `string` objects and an `array` object of 10 `string` objects. Show the necessary
    header files and don't use `using`. Do use a `const` for the number of strings.

---

## Loops

1. What's the difference between an entry-condition loop and an exit-condition loop? Which kind is each of the C++
   loops?

2. What would the following code fragment print if it were part of a valid program?
   ```cpp
   int i;
   for (i = 0; i < 5; i++)
       cout << i;
   cout << endl;
   ```

3. What would the following code fragment print if it were part of a valid program?
   ```cpp
   int j;
   for (j = 0; j < 11; j += 3)
       cout << j;
   cout << endl << j << endl;
   ```

4. What would the following code fragment print if it were part of a valid program?
   ```cpp
   int j = 5;
   while (++j < 9)
       cout << j++ << endl;
   ```

5. What would the following code fragment print if it were part of a valid program?
   ```cpp
   int k = 8;
   do
       cout << " k = " << k << endl;
   while (k++ < 5);
   ```

6. Write a `for` loop that prints the values `1 2 4 8 16 32 64` by increasing the value of a counting variable by a
   factor of two in each cycle.

7. How do you make a loop body include more than one statement?

8. Is the following statement valid? If not, why not? If so, what does it do?
   ```cpp
   int x = (1, 024);
   ```
   What about the following?
   ```cpp
   int y;
   y = 1, 024;
   ```

9. How does `cin >> ch` differ from `cin.get(ch)` and `ch = cin.get()` in how it views input?

---

## Branching

1. Consider the following two code fragments for counting spaces and newlines:
   ```cpp
   // Version 1
   while (cin.get(ch))  // quit on eof
   {
       if (ch == ' ')
           spaces++;
       if (ch == '\n')
           newlines++;
   }
   
   // Version 2
   while (cin.get(ch))  // quit on eof
   {
       if (ch == ' ')
           spaces++;
       else if (ch == '\n')
           newlines++;
   }
   ```
   What advantages, if any, does the second form have over the first?

2. In Listing 6.2, what is the effect of replacing `++ch` with `ch + 1`?

3. Carefully consider the following program:
   ```cpp
   #include <iostream>
   using namespace std;
   
   int main()
   {
       char ch;
       int ct1, ct2;
       ct1 = ct2 = 0;
       while ((ch = cin.get()) != '$')
       {
           cout << ch;
           ct1++;
           if (ch = '$')
               ct2++;
           cout << ch;
       }
       cout << "ct1 = " << ct1 << ", ct2 = " << ct2 << "\n";
       return 0;
   }
   ```
   Suppose you provide the following input, pressing the Enter key at the end of each line:
   ```
   Hi!
   Send $10 or $20 now!
   ```
   What is the output? (Recall that input is buffered.)

4. Construct logical expressions to represent the following conditions:
   a. `weight` is greater than or equal to 115 but less than 125.
   b. `ch` is `q` or `Q`.
   c. `x` is even but is not 26.
   d. `x` is even but is not a multiple of 26.
   e. `donation` is in the range 1,000–2,000 or `guest` is 1.
   f. `ch` is a lowercase letter or an uppercase letter. (Assume, as is true for ASCII, that lowercase letters are coded
   sequentially and that uppercase letters are coded sequentially but that there is a gap in the code between uppercase
   and lowercase.)

5. In English, the statement "I will not not speak" means the same as "I will speak." In C++, is `!!x` the same as `x`?

6. Construct a conditional expression that is equal to the absolute value of a variable. That is, if a variable `x` is
   positive, the value of the expression is just `x`, but if `x` is negative, the value of the expression is `-x`, which
   is positive.

7. Rewrite the following fragment using `switch`:
   ```cpp
   if (ch == 'A')
       a_grade++;
   else if (ch == 'B')
       b_grade++;
   else if (ch == 'C')
       c_grade++;
   else if (ch == 'D')
       d_grade++;
   else
       f_grade++;
   ```

8. In Listing 6.10, what advantage would there be in using character labels, such as `a` and `c`, instead of numbers for
   the menu choices and `switch` cases? (Hint: Think about what happens if the user types `q` in either case and what
   happens if the user types `5` in either case.)

9. Consider the following code fragment:
   ```cpp
   int line = 0;
   char ch;
   while (cin.get(ch))
   {
       if (ch == 'Q')
           break;
       if (ch != '\n')
           continue;
       line++;
   }
   ```
   Rewrite this code without using `break` or `continue`.

---

## Functions

1. What are the three steps in using a function?

2. Construct function prototypes that match the following descriptions:
   a. `igor()` takes no arguments and has no return value.
   b. `tofu()` takes an `int` argument and returns a `float`.
   c. `mpg()` takes two type `double` arguments and returns a `double`.
   d. `summation()` takes the name of a `long` array and an array size as values and returns a `long` value.
   e. `doctor()` takes a `string` argument (the string is not to be modified) and returns a `double` value.
   f. `ofcourse()` takes a `boss` structure as an argument and returns nothing.
   g. `plot()` takes a pointer to a `map` structure as an argument and returns a `string`.

3. Write a function that takes three arguments: the name of an `int` array, the array size, and an `int` value. Have the
   function set each element of the array to the `int` value.

4. Write a function that takes three arguments: a pointer to the first element of a range in an array, a pointer to the
   element following the end of a range in an array, and an `int` value. Have the function set each element of the array
   to the `int` value.

5. Write a function that takes a `double` array name and an array size as arguments and returns the largest value in
   that array. Note that this function shouldn't alter the contents of the array.

6. Why don't you use the `const` qualifier for function arguments that are one of the fundamental types?

7. What are the three forms a C-style string can take in a C++ program?

8. Write a function that has this prototype:
   ```cpp
   int replace(char * str, char c1, char c2);
   ```
   Have the function replace every occurrence of `c1` in the string `str` with `c2`, and have the function return the
   number of replacements it makes.

9. What does the expression `*"pizza"` mean? What about `"taco"[2]`?

10. C++ enables you to pass a structure by value, and it lets you pass the address of a structure. If `glitz` is a
    structure variable, how would you pass it by value? How would you pass its address? What are the trade-offs of the
    two approaches?

11. The function `judge()` has a type `int` return value. As an argument, it takes the address of a function. The
    function whose address is passed, in turn, takes a pointer to a `const char` as an argument and returns an `int`.
    Write the function prototype.

12. Suppose we have the following structure declaration:
    ```cpp
    struct applicant {
        char name[30];
        int credit_ratings[3];
    };
    ```
    a. Write a function that takes an `applicant` structure as an argument and displays its contents.
    b. Write a function that takes the address of an `applicant` structure as an argument and displays the contents of
    the pointed-to structure.

13. Suppose the functions `f1()` and `f2()` have the following prototypes:
    ```cpp
    void f1(applicant * a);
    const char * f2(const applicant * a1, const applicant * a2);
    ```
    When would you use `f1()`, and when would you use `f2()`?

---

## Classes

1. What is a class?

2. How does a class accomplish abstraction, encapsulation, and data hiding?

3. What is the relationship between an object and a class?

4. In what way, aside from being functions, are class function members different from class data members?

5. Define a class to represent a bank account. Data members should include the depositor's name, the account number (use
   a `string`), and the balance. Member functions should allow the following:
    - Creating an object and initializing it.
    - Displaying the depositor's name, account number, and balance
    - Depositing an amount of money given by an argument
    - Withdrawing an amount of money given by an argument

   Just show the class declaration, not the method implementations. (Programming Exercise 1 provides you with an
   opportunity to write the implementation.)

6. When are class constructors called? When are class destructors called?

7. Provide code for a constructor for the bank account class from Chapter Review Question 5.

8. What is a default constructor? What is the advantage of having one?

9. Modify the `Stock` class definition (the version in `stock20.h`) so that it has member functions that return the
   values of the individual data members. Note: A member that returns the company name should not provide a weapon for
   altering the array. That is, it can't simply return a `string` reference. It could return a `const` reference.

10. What are `this` and `*this`?

---

## Advanced Class Operations

1. Use a member function to overload the multiplication operator for the `Stonewt` class; have the operator multiply the
   data members by a type `double` value. Note that this will require carryover for the stone–pound representation. That
   is, twice 10 stone 8 pounds is 21 stone 2 pounds.

2. What are the differences between a friend function and a member function?

3. Does a nonmember function have to be a friend to access a class's members?

4. Use a friend function to overload the multiplication operator for the `Stonewt` class; have the operator multiply the
   `double` value by the Stone value.

5. Which operators cannot be overloaded?

6. What restriction applies to overloading the following operators? `=`, `()`, `[]`, and `->`

7. Define a conversion function for the `Vector` class that converts a `Vector` object to a type `double` value that
   represents the vector's magnitude.