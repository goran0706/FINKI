# C++ Programming Exercises

## C++ Essentials

1. Write a C++ program that displays your name and address (or if you value your privacy, a fictitious name and
   address).

2. Write a C++ program that asks for a distance in furlongs and converts it to yards. (One furlong is 220 yards.)

3. Write a C++ program that uses three user-defined functions (counting `main()` as one) and produces the following
   output:
   ```
   Three blind mice
   Three blind mice
   See how they run
   See how they run
   ```
   One function, called two times, should produce the first two lines, and the remaining function, also called twice,
   should produce the remaining output.

4. Write a program that asks the user to enter his or her age. The program then should display the age in months:
   ```
   Enter your age: 29
   Your age in months is 384.
   ```

5. Write a program that has `main()` call a user-defined function that takes a Celsius temperature value as an argument
   and then returns the equivalent Fahrenheit value. The program should request the Celsius value as input from the user
   and display the result, as shown in the following code:
   ```
   Please enter a Celsius value: 20
   20 degrees Celsius is 68 degrees Fahrenheit.
   ```
   For reference, here is the formula for making the conversion:
   ```
   Fahrenheit = 1.8 × degrees Celsius + 32.0
   ```

6. Write a program that has `main()` call a user-defined function that takes a distance in light years as an argument
   and then returns the distance in astronomical units. The program should request the light year value as input from
   the user and display the result, as shown in the following code:
   ```
   Enter the number of light years: 4.2
   4.2 light years = 265608 astronomical units.
   ```
   An astronomical unit is the average distance from the earth to the sun (about 150,000,000 km or 93,000,000 miles),
   and a light year is the distance light travels in a year (about 10 trillion kilometers or 6 trillion miles). (The
   nearest star after the sun is about 4.2 light years away.) Use type `double` (as in Listing 2.4) and this conversion
   factor:
   ```
   1 light year = 63,240 astronomical units
   ```

7. Write a program that asks the user to enter an hour value and a minute value. The `main()` function should then pass
   these two values to a type `void` function that displays the two values in the format shown in the following sample
   run:
   ```
   Enter the number of hours: 9
   Enter the number of minutes: 28
   Time: 9:28
   ```

---

## Fundamental Types

1. Write a short program that asks for your height in integer inches and then converts your height to feet and inches.
   Have the program use the underscore character to indicate where to type the response. Also use a `const` symbolic
   constant to represent the conversion factor.

2. Write a short program that asks for your height in feet and inches and your weight in pounds. (Use three variables to
   store the information.) Have the program report your body mass index (BMI). To calculate the BMI, first convert your
   height in feet and inches to your height in inches (1 foot = 12 inches). Then convert your height in inches to your
   height in meters by multiplying by 0.0254. Then convert your weight in pounds into your mass in kilograms by dividing
   by 2.2. Finally, compute your BMI by dividing your mass in kilograms by the square of your height in meters. Use
   symbolic constants to represent the various conversion factors.

3. Write a program that asks the user to enter a latitude in degrees, minutes, and seconds and that then displays the
   latitude in decimal format. There are 60 seconds of arc to a minute and 60 minutes of arc to a degree; represent
   these values with symbolic constants. You should use a separate variable for each input value. A sample run should
   look like this:
   ```
   Enter a latitude in degrees, minutes, and seconds:
   First, enter the degrees: 37
   Next, enter the minutes of arc: 51
   Finally, enter the seconds of arc: 19
   37 degrees, 51 minutes, 19 seconds = 37.8553 degrees
   ```

4. Write a program that asks the user to enter the number of seconds as an integer value (use type `long`, or, if
   available, `long long`) and that then displays the equivalent time in days, hours, minutes, and seconds. Use symbolic
   constants to represent the number of hours in the day, the number of minutes in an hour, and the number of seconds in
   a minute. The output should look like this:
   ```
   Enter the number of seconds: 31600000
   31600000 seconds = 365 days, 17 hours, 46 minutes, 40 seconds
   ```

5. Write a program that requests the user to enter the current world population and the current population of the U.S. (
   or of some other nation of your choice). Store the information in variables of type `long long`. Have the program
   display the percent that the U.S. (or other nation's) population is of the world's population. The output should look
   something like this:
   ```
   Enter the world's population: 6898758899
   Enter the population of the US: 310783781
   The population of the US is 4.50492% of the world population.
   ```
   You can use the Internet to get more recent figures.

6. Write a program that asks how many miles you have driven and how many gallons of gasoline you have used and then
   reports the miles per gallon your car has gotten. Or, if you prefer, the program can request distance in kilometers
   and petrol in liters and then report the result European style, in liters per 100 kilometers.

7. Write a program that asks you to enter an automobile gasoline consumption figure in the European style (liters per
   100 kilometers) and converts to the U.S. style of miles per gallon. Note that in addition to using different units of
   measurement, the U.S. approach (distance / fuel) is the inverse of the European approach (fuel / distance). Note that
   100 kilometers is 62.14 miles, and 1 gallon is 3.875 liters. Thus, 19 mpg is about 12.4 l/100 km, and 27 mpg is about
   8.7 l/100 km.

---

## Compound Types

1. Write a C++ program that requests and displays information as shown in the following example of output:
   ```
   What is your first name? Betty Sue
   What is your last name? Yewe
   What letter grade do you deserve? B
   What is your age? 22
   Name: Yewe, Betty Sue
   Grade: C
   Age: 22
   ```
   Note that the program should be able to accept first names that comprise more than one word. Also note that the
   program adjusts the grade downward—that is, up one letter. Assume that the user requests an A, a B, or a C so that
   you don't have to worry about the gap between a D and an F.

2. Rewrite Listing 4.4, using the C++ `string` class instead of `char` arrays.

3. Write a program that asks the user to enter his or her first name and then last name, and that then constructs,
   stores, and displays a third string, consisting of the user's last name followed by a comma, a space, and first name.
   Use `char` arrays and functions from the `cstring` header file. A sample run could look like this:
   ```
   Enter your first name: Flip
   Enter your last name: Fleming
   Here's the information in a single string: Fleming, Flip
   ```

4. Write a program that asks the user to enter his or her first name and then last name, and that then constructs,
   stores, and displays a third string consisting of the user's last name followed by a comma, a space, and first name.
   Use `string` objects and methods from the `string` header file. A sample run could look like this:
   ```
   Enter your first name: Flip
   Enter your last name: Fleming
   Here's the information in a single string: Fleming, Flip
   ```

5. The `CandyBar` structure contains three members. The first member holds the brand name of a candy bar. The second
   member holds the weight (which may have a fractional part) of the candy bar, and the third member holds the number of
   calories (an integer value) in the candy bar. Write a program that declares such a structure and creates a `CandyBar`
   variable called `snack`, initializing its members to `"Mocha Munch"`, `2.3`, and `350`, respectively. The
   initialization should be part of the declaration for `snack`. Finally, the program should display the contents of the
   `snack` variable.

6. The `CandyBar` structure contains three members, as described in Programming Exercise 5. Write a program that creates
   an array of three `CandyBar` structures, initializes them to values of your choice, and then displays the contents of
   each structure.

7. William Wingate runs a pizza-analysis service. For each pizza, he needs to record the following information:
    - The name of the pizza company, which can consist of more than one word
    - The diameter of the pizza
    - The weight of the pizza

   Devise a structure that can hold this information and write a program that uses a structure variable of that type.
   The program should ask the user to enter each of the preceding items of information, and then the program should
   display that information. Use `cin` (or its methods) and `cout`.

8. Do Programming Exercise 7 but use `new` to allocate a structure instead of declaring a structure variable. Also have
   the program request the pizza diameter before it requests the pizza company name.

9. Do Programming Exercise 6, but instead of declaring an array of three `CandyBar` structures, use `new` to allocate
   the array dynamically.

10. Write a program that requests the user to enter three times for the 40-yd dash (or 40-meter, if you prefer) and then
    displays the times and the average. Use an `array` object to hold the data. (Use a built-in array if `array` is not
    available.)

---

## Loops

1. Write a program that requests the user to enter two integers. The program should then calculate and report the sum of
   all the integers between and including the two integers. At this point, assume that the smaller integer is entered
   first. For example, if the user enters 2 and 9, the program should report that the sum of all the integers from 2
   through 9 is 44.

2. Redo Listing 5.4 using a type `array` object instead of a built-in array and type `long double` instead of
   `long long`. Find the value of 100!

3. Write a program that asks the user to type in numbers. After each entry, the program should report the cumulative sum
   of the entries to date. The program should terminate when the user enters 0.

4. Daphne
   invests $100 at 10% simple interest. That is, every year, the investment earns 10% of the original investment, or $10
   each and every year:
   ```
   interest = 0.10 × original balance
   ```
   At the same time, Cleo invests $100 at 5% compound interest. That is, interest is 5% of the current balance,
   including previous additions of interest:
   ```
   interest = 0.05 × current balance
   ```
   Cleo earns 5% of $100 the first year, giving her $105. The next year she earns 5% of $105, or $5.25, and so on. Write
   a program that finds how many years it takes for the value of Cleo's investment to exceed the value of Daphne's
   investment and then displays the value of both investments at that time.

5. You sell the book *C++ for Fools*. Write a program that has you enter a year's worth of monthly sales (in terms of
   number of books, not of money). The program should use a loop to prompt you by month, using an array of `char *` (or
   an array of `string` objects, if you prefer) initialized to the month strings and storing the input data in an array
   of `int`. Then, the program should find the sum of the array contents and report the total sales for the year.

6. Do Programming Exercise 5 but use a two-dimensional array to store input for 3 years of monthly sales. Report the
   total sales for each individual year and for the combined years.

7. Design a structure called `car` that holds the following information about an automobile: its make, as a string in a
   character array or in a `string` object, and the year it was built, as an integer. Write a program that asks the user
   how many cars to catalog. The program should then use `new` to create a dynamic array of that many `car` structures.
   Next, it should prompt the user to input the make (which might consist of more than one word) and year information
   for each structure. Note that this requires some care because it alternates reading strings with numeric data.
   Finally, it should display the contents of each structure. A sample run should look something like the following:
   ```
   How many cars do you wish to catalog? 2
   Car #1:
   Please enter the make: Hudson Hornet
   Please enter the year made: 1952
   Car #2:
   Please enter the make: Kaiser
   Please enter the year made: 1951
   Here is your collection:
   1952 Hudson Hornet
   1951 Kaiser
   ```

8. Write a program that uses an array of `char` and a loop to read one word at a time until the word `done` is entered.
   The program should then report the number of words entered (not counting `done`). A sample run could look like this:
   ```
   Enter words (to stop, type the word done):
   anteater birthday category dumpster
   envy finagle geometry done for sure
   You entered a total of 7 words.
   ```
   You should include the `cstring` header file and use the `strcmp()` function to make the comparison test.

9. Write a program that matches the description of the program in Programming Exercise 8, but use a `string` class
   object instead of an array. Include the `string` header file and use a relational operator to make the comparison
   test.

10. Write a program using nested loops that asks the user to enter a value for the number of rows to display. It should
    then display that many rows of asterisks, with one asterisk in the first row, two in the second row, and so on. For
    each row, the asterisks are preceded by the number of periods needed to make all the rows display a total number of
    characters equal to the number of rows. A sample run would look like this:
    ```
    Enter number of rows: 5
    ....*
    ...**
    ..***
    .****
    *****
    ```

---

## Branching

1. Write a program that reads keyboard input to the `@` symbol and that echoes the input except for digits, converting
   each uppercase character to lowercase, and vice versa. (Don't forget the `cctype` family.)

2. Write a program that reads up to 10 donation values into an array of `double`. (Or, if you prefer, use an `array`
   template object.) The program should terminate input on non-numeric input. It should report the average of the
   numbers and also report how many numbers in the array are larger than the average.

3. Write a precursor to a menu-driven program. The program should display a menu offering four choices, each labeled
   with a letter. If the user responds with a letter other than one of the four valid choices, the program should prompt
   the user to enter a valid response until the user complies. Then the program should use a `switch` to select a simple
   action based on the user's selection. A program run could look something like this:
   ```
   Please enter one of the following choices:
   c) carnivore
   p) pianist
   t) tree
   g) game
   f
   Please enter a c, p, t, or g: q
   Please enter a c, p, t, or g: t
   A maple is a tree.
   ```

4. When you join the Benevolent Order of Programmers, you can be known at BOP meetings by your real name, your job
   title, or your secret BOP name. Write a program that can list members by real name, by job title, by secret name, or
   by a member's preference. Base the program on the following structure:
   ```cpp
   // Benevolent Order of Programmers name structure
   struct bop {
       char fullname[strsize];  // real name
       char title[strsize];     // job title
       char bopname[strsize];   // secret BOP name
       int preference;          // 0 = fullname, 1 = title, 2 = bopname
   };
   ```
   In the program, create a small array of such structures and initialize it to suitable values. Have the program run a
   loop that lets the user select from different alternatives:
   ```
   a. display by name
   b. display by title
   c. display by bopname
   d. display by preference
   q. quit
   ```
   Note that "display by preference" does not mean display the preference member; it means display the member
   corresponding to the preference number. For instance, if preference is 1, choice d would display the programmer's job
   title. A sample run may look something like the following:
   ```
   Benevolent Order of Programmers Report
   a. display by name
   b. display by title
   c. display by bopname
   d. display by preference
   q. quit
   Enter your choice: a
   Wimp Macho
   Raki Rhodes
   Celia Laiter
   Hoppy Hipman
   Pat Hand
   Next choice: d
   Wimp Macho
   Junior Programmer
   MIPS
   Analyst Trainee
   LOOPY
   Next choice: q
   Bye!
   ```

5. The Kingdom of Neutronia, where the unit of currency is the tvarp, has the following income tax code:
    - First 5,000 tvarps: 0% tax
    - Next 10,000 tvarps: 10% tax
    - Next 20,000 tvarps: 15% tax
    - Tvarps after 35,000: 20% tax

   For example, someone earning 38,000 tvarps would owe 5,000 × 0.00 + 10,000 × 0.10 + 20,000 × 0.15 + 3,000 × 0.20, or
   4,600 tvarps. Write a program that uses a loop to solicit incomes and to report tax owed. The loop should terminate
   when the user enters a negative number or non-numeric input.

6. Put together a program that keeps track of monetary contributions to the Society for the Preservation of Rightful
   Influence. It should ask the user to enter the number of contributors and then solicit the user to enter the name and
   contribution of each contributor. The information should be stored in a dynamically allocated array of structures.
   Each structure should have two members: a character array (or else a `string` object) to store the name and a
   `double` member to hold the amount of the contribution. After reading all the data, the program should display the
   names and amounts donated for all donors who contributed $10,000 or more. This list should be headed by the label
   Grand Patrons. After that, the program should list the remaining donors. That list should be headed Patrons. If there
   are no donors in one of the categories, the program should print the word "none." Aside from displaying two
   categories, the program need do no sorting.

7. Write a program that reads input a word at a time until a lone `q` is entered. The program should then report the
   number of words that began with vowels, the number that began with consonants, and the number that fit neither of
   those categories. One approach is to use `isalpha()` to discriminate between words beginning with letters and those
   that don't and then use an `if` or `switch` statement to further identify those passing the `isalpha()` test that
   begin with vowels. A sample run might look like this:
   ```
   Enter words (q to quit):
   The 12 awesome oxen ambled
   quietly across 15 meters of lawn. q
   5 words beginning with vowels
   4 words beginning with consonants
   2 others
   ```

8. Write a program that opens a text file, reads it character-by-character to the end of the file, and reports the
   number of characters in the file.

9. Do Programming Exercise 6 but modify it to get information from a file. The first item in the file should be the
   number of contributors, and the rest of the file should consist of pairs of lines, with the first line of each pair
   being a contributor's name and the second line being a contribution. That is, the file should look like this:
   ```
   4
   Sam Stone
   2000
   Freida Flass
   100500
   Tammy Tubbs
   5000
   Rich Raptor
   55000
   ```

---

## Functions

1. Write a program that repeatedly asks the user to enter pairs of numbers until at least one of the pair is 0. For each
   pair, the program should use a function to calculate the harmonic mean of the numbers. The function should return the
   answer to `main()`, which should report the result. The harmonic mean of the numbers is the inverse of the average of
   the inverses and can be calculated as follows:
   ```
   harmonic mean = 2.0 × x × y / (x + y)
   ```

2. Write a program that asks the user to enter up to 10 golf scores, which are to be stored in an array. You should
   provide a means for the user to terminate input prior to entering 10 scores. The program should display all the
   scores on one line and report the average score. Handle input, display, and the average calculation with three
   separate array-processing functions.

3. Here is a structure declaration:
   ```cpp
   struct box {
       char maker[40];
       float height;
       float width;
       float length;
       float volume;
   };
   ```
   a. Write a function that passes a `box` structure by value and that displays the value of each member.

   b. Write a function that passes the address of a `box` structure and that sets the `volume` member to the product of
   the other three dimensions.

   c. Write a simple program that uses these two functions.

4. Many state lotteries use a variation of the simple lottery portrayed by Listing 7.4. In these variations you choose
   several numbers from one set and call them the field numbers. For example, you might select five numbers from the
   field of 1–47. You also pick a single number (called a mega number or a power ball, etc.) from a second range, such
   as 1–27. To win the grand prize, you have to guess all the picks correctly. The chance of winning is the product of
   the probability of picking all the field numbers times the probability of picking the mega number. For instance, the
   probability of winning the example described here is the product of the probability of picking 5 out of 47 correctly
   times the probability of picking 1 out of 27 correctly. Modify Listing 7.4 to calculate the probability of winning
   this kind of lottery.

5. Define a recursive function that takes an integer argument and returns the factorial of that argument. Recall that 3
   factorial, written 3!, equals 3 × 2!, and so on, with 0! defined as 1. In general, if n is greater than zero, n! =
   n × (n - 1)!. Test your function in a program that uses a loop to allow the user to enter various values for which
   the program reports the factorial.

6. Write a program that uses the following functions:
    - `Fill_array()` takes as arguments the name of an array of `double` values and an array size. It prompts the user
      to enter `double` values to be entered in the array. It ceases taking input when the array is full or when the
      user enters non-numeric input, and it returns the actual number of entries.
    - `Show_array()` takes as arguments the name of an array of `double` values and an array size and displays the
      contents of the array.
    - `Reverse_array()` takes as arguments the name of an array of `double` values and an array size and reverses the
      order of the values stored in the array.

   The program should use these functions to fill an array, show the array, reverse the array, show the array, reverse
   all but the first and last elements of the array, and then show the array.

7. Redo Listing 7.7, modifying the three array-handling functions to each use two pointer parameters to represent a
   range. The `fill_array()` function, instead of returning the actual number of items read, should return a pointer to
   the location after the last location filled; the other functions can use this pointer as the second argument to
   identify the end of the data.

8. Redo Listing 7.15 without using the `array` class. Do two versions:

   a. Use an ordinary array of `const char *` for the strings representing the season names, and use an ordinary array
   of `double` for the expenses.

   b. Use an ordinary array of `const char *` for the strings representing the season names, and use a structure whose
   sole member is an ordinary array of `double` for the expenses. (This design is similar to the basic design of the
   `array` class.)

9. This exercise provides practice in writing functions dealing with arrays and structures. The following is a program
   skeleton. Complete it by providing the described functions:
   ```cpp
   #include <iostream>
   using namespace std;

   const int SLEN = 30;
   struct student {
       char fullname[SLEN];
       char hobby[SLEN];
       int ooplevel;
   };

   // getinfo() has two arguments: a pointer to the first element of
   // an array of student structures and an int representing the
   // number of elements of the array. The function solicits and
   // stores data about students. It terminates input upon filling
   // the array or upon encountering a blank line for the student
   // name. The function returns the actual number of array elements
   // filled.
   int getinfo(student pa[], int n);

   // display1() takes a student structure as an argument
   // and displays its contents
   void display1(student st);

   // display2() takes the address of student structure as an
   // argument and displays the structure's contents
   void display2(const student * ps);

   // display3() takes the address of the first element of an array
   // of student structures and the number of array elements as
   // arguments and displays the contents of the structures
   void display3(const student pa[], int n);

   int main() {
       cout << "Enter class size: ";
       int class_size;
       cin >> class_size;
       
       while (cin.get() != '\n')
           continue;
       
       student * ptr_stu = new student[class_size];
       int entered = getinfo(ptr_stu, class_size);
       
       for (int i = 0; i < entered; i++) {
           display1(ptr_stu[i]);
           display2(&ptr_stu[i]);
       }
       
       display3(ptr_stu, entered);
       delete [] ptr_stu;
       cout << "Done\n";
       return 0;
   }
   ```

10. Design a function `calculate()` that takes two type `double` values and a pointer to a function that takes two
    `double` arguments and returns a `double`. The `calculate()` function should also be type `double`, and it should
    return the value that the pointed-to function calculates, using the `double` arguments to `calculate()`. For
    example, suppose you have this definition for the `add()` function:
    ```cpp
    double add(double x, double y) {
        return x + y;
    }
    ```
    Then, the function call in the following would cause `calculate()` to pass the values 2.5 and 10.4 to the `add()`
    function and then return the `add()` return value (12.9):
    ```cpp
    double q = calculate(2.5, 10.4, add);
    ```
    Use these functions and at least one additional function in the `add()` mold in a program. The program should use a
    loop that allows the user to enter pairs of numbers. For each pair, use `calculate()` to invoke `add()` and at least
    one other function. If you are feeling adventurous, try creating an array of pointers to `add()`-style functions and
    use a loop to successively apply to `calculate()` to a series of functions by using these pointers. Hint: Here's how
    to declare such an array of three pointers:
    ```cpp
    double (*pf[3])(double, double);
    ```
    You can initialize such an array by using the usual array initialization syntax and function names as addresses.

---

## Classes

1. Provide method definitions for the class described in Chapter Review Question 5 and write a short program that
   illustrates all the features.

2. Here is a rather simple class definition:
   ```cpp
   class Person {
   private:
       static const LIMIT = 25;
       string lname;        // Person's last name
       char fname[LIMIT];   // Person's first name
   
   public:
       Person() { lname = ""; fname[0] = '\0'; }  // #1
       Person(const string & ln, const char * fn = "Heyyou");  // #2
       
       // the following methods display lname and fname
       void Show() const;        // firstname lastname format
       void FormalShow() const;  // lastname, firstname format
   };
   ```
   (It uses both a `string` object and a character array so that you can compare how the two forms are used.) Write a
   program that completes the implementation by providing code for the undefined methods. The program in which you use
   the class should also use the three possible constructor calls (no arguments, one argument, and two arguments) and
   the two display methods. Here's an example that uses the constructors and methods:
   ```cpp
   Person one;                              // use default constructor
   Person two("Smythecraft");               // use #2 with one default argument
   Person three("Dimwiddy", "Sam");         // use #2, no defaults
   one.Show();
   cout << endl;
   one.FormalShow();
   // etc. for two and three
   ```

3. Do Programming Exercise 1 from Chapter 9 but replace the code shown there with an appropriate `golf` class
   declaration. Replace `setgolf(golf &, const char *, int)` with a constructor with the appropriate argument for
   providing initial values. Retain the interactive version of `setgolf()` but implement it by using the constructor. (
   For example, for the code for `setgolf()`, obtain the data, pass the data to the constructor to create a temporary
   object, and assign the temporary object to the invoking object, which is `*this`.)

4. Do Programming Exercise 4 from Chapter 9 but convert the `Sales` structure and its associated functions to a class
   and its methods. Replace the `setSales(Sales &, double [], int)` function with a constructor. Implement the
   interactive `setSales(Sales &)` method by using the constructor. Keep the class within the namespace `SALES`.

5. Consider the following structure declaration:
   ```cpp
   struct customer {
       char fullname[35];
       double payment;
   };
   ```
   Write a program that adds and removes customer structures from a stack, represented by a `Stack` class declaration.
   Each time a customer is removed, his or her payment should be added to a running total, and the running total should
   be reported. Note: You should be able to use the `Stack` class unaltered; just change the `typedef` declaration so
   that `Item` is type `customer` instead of `unsigned long`.

6. Here's a class declaration:
   ```cpp
   class Move {
   private:
       double x;
       double y;
   public:
       Move(double a = 0, double b = 0);   // sets x, y to a, b
       showmove() const;                   // shows current x, y values
       Move add(const Move & m) const;
       // this function adds x of m to x of invoking object to get new x,
       // adds y of m to y of invoking object to get new y, creates a new
       // move object initialized to new x, y values and returns it
       reset(double a = 0, double b = 0);  // resets x,y to a, b
   };
   ```
   Create member function definitions and a program that exercises the class.

7. A Betelgeusean plorg has these properties:

   **Data:**
    - A plorg has a name with no more than 19 letters.
    - A plorg has a contentment index (CI), which is an integer.

   **Operations:**
    - A new plorg starts out with a name and a CI of 50.
    - A plorg's CI can change.
    - A plorg can report its name and CI.
    - The default plorg has the name "Plorga".

   Write a `Plorg` class declaration (including data members and member function prototypes) that represents a plorg.
   Write the function definitions for the member functions. Write a short program that demonstrates all the features of
   the `Plorg` class.

8. You can describe a simple list as follows:
    - The simple list can hold zero or more items of some particular type.
    - You can create an empty list.
    - You can add items to the list.
    - You can determine whether the list is empty.
    - You can determine whether the list is full.
    - You can visit each item in the list and perform some action on it.

   As you can see, this list really is simple; it doesn't allow insertion or deletion, for example. Design a `List`
   class to represent this abstract type. You should provide a `list.h` header file with the class declaration and a
   `list.cpp` file with the class method implementations. You should also create a short program that utilizes your
   design.

   The main reason for keeping the list specification simple is to simplify this programming exercise. You can implement
   the list as an array or, if you're familiar with the data type, as a linked list. But the public interface should not
   depend on your choice. That is, the public interface should not have array indices, pointers to nodes, and so on. It
   should be expressed in the general concepts of creating a list, adding an item to the list, and so on. The usual way
   to handle visiting each item and performing an action is to use a function that takes a function pointer as an
   argument:
   ```cpp
   void visit(void (*pf)(Item &));
   ```
   Here `pf` points to a function (not a member function) that takes a reference to `Item` argument, where `Item` is the
   type for items in the list. The `visit()` function applies this function to each item in the list. You can use the
   `Stack` class as a general guide.

---

## Advanced Class Operations

1. Modify Listing 11.15 so that it writes the successive locations of the random walker into a file. Label each position
   with the step number. Also have the program write the initial conditions (target distance and step size) and the
   summarized results to the file. The file contents might look like this:
   ```
   Target Distance: 100, Step Size: 20
   0: (x,y) = (0, 0)
   1: (x,y) = (-11.4715, 16.383)
   2: (x,y) = (-8.68807, -3.42232)
   ...
   26: (x,y) = (42.2919, -78.2594)
   27: (x,y) = (58.6749, -89.7309)
   After 27 steps, the subject has the following location:
   (x,y) = (58.6749, -89.7309)
   or
   (m,a) = (107.212, -56.8194)
   Average outward distance per step = 3.97081
   ```

2. Modify the `Vector` class header and implementation files (Listings 11.13 and 11.14) so that the magnitude and angle
   are no longer stored as data components. Instead, they should be calculated on demand when the `magval()` and
   `angval()` methods are called. You should leave the public interface unchanged (the same public methods with the same
   arguments) but alter the private section, including some of the private method and the method implementations. Test
   the modified version with Listing 11.15, which should be left unchanged because the public interface of the `Vector`
   class is unchanged.

3. Modify Listing 11.15 so that instead of reporting the results of a single trial for a particular target/step
   combination, it reports the highest, lowest, and average number of steps for N trials, where N is an integer entered
   by the user.

4. Rewrite the final `Time` class example (Listings 11.10, 11.11, and 11.12) so that all the overloaded operators are
   implemented using friend functions.

5. Rewrite the `Stonewt` class (Listings 11.16 and 11.17) so that it has a state member that governs whether the object
   is interpreted in stone form, integer pounds form, or floating-point pounds form. Overload the `<<` operator to
   replace the `show_stn()` and `show_lbs()` methods. Overload the addition, subtraction, and multiplication operators
   so that one can add, subtract, and multiply `Stonewt` values. Test your class with a short program that uses all the
   class methods and friends.

6. Rewrite the `Stonewt` class (Listings 11.16 and 11.17) so that it overloads all six relational operators. The
   operators should compare the pounds members and return a type `bool` value. Write a program that declares an array of
   six `Stonewt` objects and initializes the first three objects in the array declaration. Then it should use a loop to
   read in values used to set the remaining three array elements. Then it should report the smallest element, the
   largest element, and how many elements are greater or equal to 11 stone. (The simplest approach is to create a
   `Stonewt` object initialized to 11 stone and to compare the other objects with that object.)

7. A complex number has two parts: a real part and an imaginary part. One way to write an imaginary number is this: (
   3.0, 4.0). Here 3.0 is the real part and 4.0 is the imaginary part. Suppose a = (A, Bi) and c = (C, Di). Here are
   some complex operations:
    - **Addition:** a + c = (A + C, (B + D)i)
    - **Subtraction:** a - c = (A - C, (B - D)i)
    - **Multiplication:** a × c = (A × C - B × D, (A × D + B × C)i)
    - **Multiplication:** (x a real number): x × c = (x × C, x × Di)
    - **Conjugation:** ~a = (A, -Bi)

   Define a `complex` class so that the following program can use it with correct results:
   ```cpp
   #include <iostream>
   using namespace std;
   #include "complex0.h"  // to avoid confusion with complex.h
   
   int main() {
       complex a(3.0, 4.0);  // initialize to (3,4i)
       complex c;
       cout << "Enter a complex number (q to quit):\n";
       while (cin >> c) {
           cout << "c is " << c << '\n';
           cout << "complex conjugate is " << ~c << '\n';
           cout << "a is " << a << '\n';
           cout << "a + c is " << a + c << '\n';
           cout << "a - c is " << a - c << '\n';
           cout << "a * c is " << a * c << '\n';
           cout << "2 * c is " << 2 * c << '\n';
           cout << "Enter a complex number (q to quit):\n";
       }
       cout << "Done!\n";
       return 0;
   }
   ```
   Note that you have to overload the `<<` and `>>` operators. Standard C++ already has complex support—rather more
   extensive than in this example—in a `complex` header file, so use `complex0.h` to avoid conflicts. Use `const`
   whenever warranted.

   Here is a sample run of the program:
   ```
   Enter a complex number (q to quit):
   real: 10
   imaginary: 12
   c is (10,12i)
   complex conjugate is (10,-12i)
   a is (3,4i)
   a + c is (13,16i)
   a - c is (-7,-8i)
   a * c is (-18,76i)
   2 * c is (20,24i)
   Enter a complex number (q to quit):
   real: q
   Done!
   ```
   Note that `cin >> c`, through overloading, now prompts for real and imaginary parts.