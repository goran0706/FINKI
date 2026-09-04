# Getting Started with C++

> - The history and philosophy of C and of C++
> - Procedural versus object-oriented programming
> - How C++ adds object-oriented concepts to the C language
> - How C++ adds generic programming concepts to the C language
> - Programming language standards
> - The mechanics of creating a program

C++ programming language accommodates several programming paradigms: the traditional procedural programming,
object-oriented programming and generic programming. C++ is a superset to C, which blends the C language with support
for object-oriented programming and for generic programming.

C++ joins three separate programming methodologies:

- **procedural programming**, represented by C;
- **object-oriented programming**, represented by the class enhancements C++ adds to C;
- **generic programming**, supported by C++ template features.

Each of these methodologies contributes important characteristics to C++:

- C brings to C++ the tradition of an efficient, compact, fast, and portable language.
- Object-oriented programming brings to C++ a new methodology designed to handle the complexity of modern programs.
- Templates bring to C++ another methodology called generic programming, enabling reusable, type-independent code.

## History of C Language

In the early **1970s, Dennis Ritchie of Bell Laboratories** was working on a project to develop the **Unix operating
system**
(An operating system is a set of programs that manages a computer’s resources and handles its interactions with users).
For this work Ritchie needed a language that was concise, that produced compact, fast programs, and that could control
hardware efficiently.

Traditionally, programmers met these needs by using **assembly language**, which is closely tied to a
computer’s internal machine language. However, assembly language is a **low-level** language—that is, it works directly
with the hardware (for instance, accessing CPU registers and memory locations directly). Thus, assembly language is
specific to a particular computer processor. So if you want to move an assembly program to a different kind of computer,
you may have to completely rewrite the program, using a different assembly language.

But **Unix** was intended to work on a variety of computer types (or platforms). That suggested using a **high-level**
language. **A high-level language is oriented toward problem-solving instead of toward specific hardware.**
**Special programs called compilers translate a high-level language to the internal language of a particular computer.
Thus, you can use the same high-level language program on different platforms by using a separate compiler for each
platform.** Ritchie wanted a language that combined **low-level efficiency and hardware access** with **high-level
generality and portability.** So building from older languages, **he created C.**

## C Programming Philosophy

In general, computer languages deal with two concepts: **data** and **algorithms**.

- **The data constitutes the information a program uses and processes.**
- **The algorithms are the methods the program uses.**

Like most mainstream languages when C was created, C is a **procedural language**. That means it **emphasizes the
algorithm side of programming**. Conceptually, **procedural programming consists of figuring out the actions a computer
should take and then using the programming language to implement those actions**. A program **prescribes a set of
procedures for the computer to follow to produce a particular outcome**, much as **a recipe prescribes a set of
procedures for a cook to follow to produce a cake**.

In simple terms: **Data + Algorithm = Program**

```bash
input → procedure/algorithm → output
```

Earlier procedural languages such as **FORTRAN** and **BASIC** ran into **organizational problems as programs grew
larger**. Many programs used numerous **branching statements to one or another set of instructions**, creating tangled
control flow known as **“spaghetti programming”**, which made programs **difficult to read, understand, and modify**.

To address this problem, computer scientists developed **structured programming**, a more **disciplined programming
style that limits branching to a small set of well-defined control structures**.

C supports **structured programming** through built-in constructs such as:

- `for` loop
- `while` loop
- `do while` loop
- `if else` statement

**Top-down design** is another important principle of procedural programming. It means **breaking a large program into
smaller, more manageable tasks.** If a task is still too broad, it is **divided into even smaller tasks** until the
program is organized into **small, easily programmed modules**.

C supports this approach by encouraging the use of **functions**, where **each function represents a specific task
module.**

Overall, **structured programming and top-down design reflect the procedural mindset**, which **focuses on the actions a
program performs.**

## The C++ Shift: Object-Oriented Programming

Although structured programming improved the clarity, reliability, and maintenance of programs, large-scale programming
still remained a challenge. Object-Oriented Programming (OOP) addresses this by emphasizing **data rather than
algorithms**. Rather than try to **fit a problem to the procedural approach** of a language, OOP attempts to **fit the
language to the problem**. The idea is to design data forms that correspond to the essential features of a problem. In
C++, a **class** is a specification describing a new data form, and an **object** is a particular instance created
according to that class. A class defines both the **data used to represent an object** and the **operations that can be
performed on that data**. Each object created from the class holds its own data and can be manipulated through the
class’s methods.

The OOP approach to program design is to first **design classes representing entities** the program deals with and
**define permissible operations** for each class. Programs are then built using **objects of these classes**, a process
called **bottom-up programming**. The process of going from a lower level of organization, such as classes, to a higher
level, such as program design, is called bottom-up programming. OOP introduces several key concepts that form the **four
pillars of OOP**:

1. **Encapsulation**: Protecting internal state and controlling how it is accessed and changed.
2. **Abstraction**: Exposing essential behavior while hiding implementation details.
3. **Inheritance**: Creating a new class from an existing class to reuse and extend behavior.
4. **Polymorphism**: Using the same interface to represent different behaviors.

By focusing on **representing concepts instead of tasks**, C++ supports the development of **reliable, maintainable, and
reusable programs**. It also allows programmers to **reuse and adapt existing, well-tested class libraries** for
different platforms.

## C++ and Generic Programming

**Generic programming** is another **programming paradigm supported by C++**. Like object-oriented programming, it aims
to **make code reuse easier** and uses the technique of **abstracting general concepts**. However, the focus differs
from OOP.

While **OOP emphasizes the data aspect of programming, generic programming emphasizes independence from a
particular data type**. The goal is to write **type-independent code** that can work with many different data types.

The term **generic** refers to **code that is type independent**. Normally, operations such as sorting would require
**separate functions for each data type** (integers, floating-point numbers, characters, strings, or user-defined
types). **Generic programming allows a function to be written once for a generic, unspecified type and then used with
many actual data types**.

In C++, this capability is provided through **templates**, which allow programmers to **write
type-independent functions and classes that can operate on different data types**.

**Generic programming** in C++ focuses on **type-independent code reuse**, and this is **achieved through templates**.

## The Genesis of C++

C++ was developed by **Bjarne Stroustrup** at **Bell Laboratories** in the **early 1980s**. The language was designed to
**make writing good programs easier and more pleasant for programmers**.

Stroustrup focused on p**ractical usefulness rather than strict programming philosophies**. Real programming needs were
considered **more important than theoretical purity** when designing C++.

The **object-oriented features of C++** were inspired by **Simula 67**. Stroustrup added **object-oriented programming
features and later templates for generic programming** to C **without significantly changing the original C language**.

Because of this design, **C++ is a superset of C**, meaning **most valid C programs are also valid C++ programs**. C++
programs can also **use existing C libraries**, which provide reusable solutions to common programming problems. The
name C++ comes from the **C increment operator (++)**, indicating **an enhanced version of C**.

C++ combines multiple capabilities:

- The C component allows low-level access close to hardware.
- The OOP component allows programs to model real-world concepts.
- Templates enable generic programming.

Because C++ supports **procedural programming, object-oriented programming, and generic programming**, the language
emphasizes **practical utility over strict ideology**, which is a major reason for its widespread adoption.

## Portability and Standards

A program is considered **portable** if it can be **recompiled on a different platform and run correctly without
modifying the source code**. For example, a C++ program written on one system can run on another system with a different
operating system or processor, provided it is **recompiled with a compiler for that platform**.

Two main factors influence portability:

**Hardware dependency**. Programs that rely on **hardware-specific features** (such as directly controlling a specific
video board) are difficult to run on different systems. Portability can be improved by isolating **hardware-dependent
code into separate function modules**, so only those modules need modification when moving to another platform.

**Language divergence**. Different implementations of a language can develop **dialects**, which can reduce
compatibility between systems. To address this issue, standardization efforts were introduced. The **American National
Standards Institute** formed the **ANSI X3J16 committee in 1990** to develop a standard for C++. The **International
Organization for Standardization** later joined with its **ISO-WG-21 committee**, creating **a joint ANSI/ISO effort to
standardize C++**.

C++ combines two important characteristics that influence portability and capability:

- The **OOP heritage** provides a **high level of abstraction**.
- The **C heritage** provides **low-level access to hardware**.

## The Mechanics of Creating a Program

To run a C++ program, the program must go through several steps that transform the written code into a form the computer
can execute.

1. First, the programmer writes the program using a **text editor** and saves it as a file. This file contains the
   **source code**, which is the human-readable C++ code.
2. Next, the **compiler** translates the **source cod**e into **machine language**, the internal language used by the
   computer. The result of this translation is called **object code**.
3. Finally, the **linker** combines the **object code** with additional code required to run the program. This includes
   **library code** (prewritten functions such as displaying output or performing calculations) and **startup code**.
   After linking, the final file produced is the **executable code**, which is the program that the computer can run.

**Process summary:**

```bash
Source code → Compiler → Object code → Linker (with libraries and startup code) → Executable code.
```

IDE Build and Execution Commands

After a project is set up in an IDE (Integrated Development Environment), several commands are used to compile, link,
and run the program.

- **Compile** – compiles the code in the currently open source file.
- **Build** / **Make** – compiles all source files in the project, usually incrementally (only files that changed are
  recompiled).
- **Build All** – recompiles all source files from scratch, regardless of changes.
- **Link** – combines the compiled object code with the required library code to create the final program.
- **Run** / **Execute** – runs the program; if compilation or linking has not been done, the IDE typically performs
  those steps first.
- **Debug** – runs the program in debug mode, allowing the program to be executed step-by-step to find and fix errors.

## Summary

As computers became more powerful, programs grew **larger and more complex**, which required improvements in programming
languages to better manage the development process. The **C language** introduced features such as **control structures
and functions**, enabling **structured and modular programming**. **C++ extends C** by adding support for
**object-oriented programming (OOP)** and **generic programming**, which increases **modularity**, **code reuse**,
and **program reliability**.

The widespread use of C++ led to many implementations across different platforms. To maintain compatibility, standards
were developed by the **International Organization for Standardization**, including **C++98**, **C++03**, and **C++11**.
These standards define the **features, behavior, and standard library (functions, classes, and templates)** of the
language, helping ensure **portability across different platforms and implementations**.

To create a C++ program, programmers write **source files containing C++ code**. These files must then be **compiled and
linked** to produce **machine-language executable programs**. This process is commonly handled within an **Integrated
Development Environment**, which typically provides a **text editor, compiler, linker, project management tools, and
debugging capabilities**. The same tasks can also be performed using **command-line tools**.
