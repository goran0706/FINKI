// basics.cpp -- shows important C++ basics with descriptive explanations

#include <iostream>

/*
--------------------------------------------------------------------
PREPROCESSOR
--------------------------------------------------------------------

C++ uses a preprocessor, which is a program that processes a source file before the main compilation takes place.
Preprocessor directives begin with the # symbol and provide instructions to the preprocessor.

Example:
    #include <iostream>

This directive tells the preprocessor to include the contents of the file iostream into the program before compilation.
In effect, the contents of the iostream file replace the line #include <iostream> in the program.
Files such as iostream are called header files or include files because they are included at the beginning of a program.
Programs that use cin and cout for input and output must include the iostream header file.
*/


int main() // function header
{
    using namespace std;

    /*
    ----------------------------------------------------------------
    USING DIRECTIVE
    ----------------------------------------------------------------

    Many names in the C++ standard library are defined inside the namespace called std (standard definition).

    Examples include:

        cout
        cin
        endl

    Their full names are actually:

        std::cout
        std::cin
        std::endl

    A using directive allows these names to be used without writing the std:: prefix.

    Example:

        using namespace std;

    Alternative approaches include:

        using std::cout;
        using std::endl;
        using std::cin;

    Another possibility is placing the using directive outside all functions, making it global:

        using namespace std;

    This approach makes all names in the std namespace visible throughout the program, but it is sometimes avoided in
    large programs to prevent name conflicts.
    */


    /*
    ----------------------------------------------------------------
    BASIC OUTPUT
    ----------------------------------------------------------------
    */

    cout << "Come up and C++ me some time.";
    cout << endl;
    cout << "You won't regret it!" << endl;


    /*
    ----------------------------------------------------------------
    NEWLINE METHODS
    ----------------------------------------------------------------

    There are two common ways to start a new line in output.

    1) Using the newline escape sequence '\n'

        cout << "Hello\n";

    The '\n' character inserts a newline into the output stream.

    2) Using the manipulator endl

        cout << "Hello" << endl;

    The endl manipulator performs two actions:

        1. Inserts a newline character
        2. Flushes the output buffer

    Flushing the buffer forces the text to appear immediately on the screen.
    Because flushing can slow performance, many programmers prefer '\n' unless immediate display is required.
    */

    cout << "Example using newline character\n";
    cout << "Example using endl" << endl;


    /*
    ----------------------------------------------------------------
    C++ INPUT AND OUTPUT STREAMS
    ----------------------------------------------------------------

    cout is an output stream object used to display information on the screen.
    cin is an input stream object used to obtain data from the user.

    The << operator is called the insertion operator because it inserts data into the output stream.
    The >> operator is called the extraction operator because it extracts data from the input stream.

    Example:
    */

    int number;

    cout << "Enter a number: ";
    cin >> number;

    cout << "You entered: " << number << endl;


    /*
    ----------------------------------------------------------------
    TOKENS
    ----------------------------------------------------------------

    The basic indivisible elements of a C++ program are called tokens.
    A token is the smallest meaningful unit that the compiler recognizes.

    Examples of tokens include:

        keywords        (int, return)
        identifiers     (variable names)
        operators       (=, <<, >>)
        constants       (10, 3.14)
        punctuation     (; , { } )

    Tokens must be separated from each other by whitespace.
    Whitespace includes spaces, tabs, and newline characters.

    Example statement:

        int age = 25;

    Tokens:

        int | age | = | 25 | ;
    */


    /*
    ----------------------------------------------------------------
    COMMENTS
    ----------------------------------------------------------------

    Comments are notes inserted into a program to help explain the code. They are ignored by the compiler.

    You should use comments to document your programs. The more complex the program, the more valuable comments are.
    Not only do they help others to understand what you have done, but also they help you understand what you’ve done,
    especially if you haven’t looked at the program for a while.

    C++ supports two types of comments.
    */

    // 1) C-style comments (multi-line)

    /*
       This is a
       multi-line comment
    */

    // 2) C++ style comments (single - line)

    // This is a single-line comment


    /*
    ----------------------------------------------------------------
    STATEMENTS
    ----------------------------------------------------------------

    A statement is a complete instruction in a C++ program.

    Most statements end with a semicolon.

    Examples:

        int x;
        x = 5;
        cout << x;
    */


    /*
    ----------------------------------------------------------------
    DECLARATION STATEMENT
    ----------------------------------------------------------------

    Computers are precise and orderly machines. To store an item of information in a computer, you must identify both
    the storage location and how much memory storage space the information requires.

    A declaration statement tells the compiler:

        1. The type of storage needed
        2. The name (label) of the storage location

    Example:

        int age;

    This declares a variable named age capable of storing integer values.
    */

    int age;


    /*
    ----------------------------------------------------------------
    VARIABLE
    ----------------------------------------------------------------

    A variable is a named memory location used to store a value.

    It is called a variable because the value stored at that location can change during the execution of a program.

    Modern C++ style suggests declaring variables as close to their first use as possible.
    */

    age = 21;


    /*
    ----------------------------------------------------------------
    ASSIGNMENT STATEMENT
    ----------------------------------------------------------------

    An assignment statement assigns a value to a variable.

    The symbol = is called the assignment operator.

    Example:
    */

    int value;
    value = 10;

    /*
    Multiple assignment is allowed in C++ and is evaluated from right to left.

    Example:
    */

    int steinway;
    int baldwin;
    int yamaha;

    yamaha = baldwin = steinway = 88;

    /*
    Evaluation order:

        steinway = 88
        baldwin  = 88
        yamaha   = 88
    */


    /*
    ----------------------------------------------------------------
    MESSAGE STATEMENT
    ----------------------------------------------------------------

    A message statement sends a message to an object, initiating some sort of action.

    */


    /*
    ----------------------------------------------------------------
    FUNCTIONS
    ----------------------------------------------------------------

    A function is a block of code designed to perform a particular task.

    A C++ program should provide a prototype for each function used in the program.

    A function prototype does for functions what a variable declaration does for variables.

    A function prototype declares the return type for a function, name, along with the number and type of arguments.

    Functions help organize programs into manageable pieces and allow code to be reused.

    A function typically consists of two parts:

        function header
        function body
    */


    /*
    FUNCTION HEADER

    The function header specifies:

        return type
        function name
        parameter list

    Example:

        main()
        int main()
        int main(void)
    */


    /*
    FUNCTION BODY

    The function body contains the statements that define what the function does.

    It is enclosed in braces { }.
    */


    /*
    FUNCTION RETURN TYPE

    The return type specifies the type of value the function sends back to the caller.

    Example:

        int main()

    indicates that the function returns an integer value.
    */


    /*
       FUNCTION FORM

       Example:

           type functionName(argumentList) {
               statements
           }
    */


    /*
    RETURN STATEMENT

    The return statement ends the execution of a function and optionally sends a value back to the calling function.

    Example:

        return 0;
    */


    /*
    FUNCTION CALL

    A function call is the statement that causes a function to execute.

    Example:

        cout << "Hello";
    */


    /*
    FUNCTION CALLER AND CALLED FUNCTION:

    The function that initiates the call is known as the caller.
    The function being executed is known as the called function.
    */


    /*
    PARAMETERS AND ARGUMENTS:

    The value in the parentheses is information that is sent to the function; it is said to be passed to the function.

    PARAMETERS are variables listed in the function definition.
    ARGUMENTS are the actual values passed to the function when it is called.

    Example:

        int add(int a, int b)   // parameters
        add(5, 3);              // arguments
    */


    /*
    VOID:

    The keyword void explicitly indicates that the function takes no arguments. If you omit void and leave the
    parentheses empty, C++ interprets this as an implicit declaration that there are no arguments.

    The keyword void explicitly indicates that the function does not return a value. If you omit void and leave the
    return type empty, C++ interprets this as a function with no return value.
    */


    /*
     ----------------------------------------------------------------
     NAMESPACES AND NAME CONFLICTS
     ----------------------------------------------------------------

     Namespaces help avoid conflicts when different parts of a program use the same names.
     Namespaces can only be defined in global or namespace scope

     Example:

         namespace Microflop {
             void wanda();
         }

         namespace Piscine {
             void wanda();
         }

     Usage:

         Microflop::wanda("go dancing?");
         Piscine::wanda("a fish named Desire");
    */


    /*
    ----------------------------------------------------------------
    MAIN FUNCTION STYLES
    ----------------------------------------------------------------

    Different forms of the main function exist.

    Classic C style:

        main()

    Standard C++ style:

        int main()

    Explicit style:

        int main(void)

    In C++ the main function normally returns an integer value to the operating system.
    */


    /*
    RETURN VALUE OF MAIN
    ----------------------------------------------------------------

    A return value of 0 indicates that the program ended successfully.

    Example:

        return 0;

    In modern C++, if execution reaches the end of main(), an implicit return 0 is automatically provided.

    This implicit return applies only to main() and not to other functions.
    */

    return 0;
}
