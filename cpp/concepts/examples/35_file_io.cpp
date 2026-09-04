// =============================================================================
// file_io.cpp — File Input and Output in C++
// =============================================================================
//
// FILE STREAM CLASSES
//
//   C++ uses stream classes from <fstream> for file operations.
//
//     ifstream   → input file stream   (read from file)
//     ofstream   → output file stream  (write to file)
//     fstream    → input + output      (read/write)
//
//   Header required:
//     #include <fstream>
//
//   Files must be OPENED before use and CLOSED when finished.
//
// ─────────────────────────────────────────────────────────────────────────
// OPENING FILES
// ─────────────────────────────────────────────────────────────────────────
//
//   Two ways to open files:
//
//   1. Constructor
//
//      ifstream inFile("data.txt");
//
//   2. open() member function
//
//      ifstream inFile;
//      inFile.open("data.txt");
//
//   Always check if the file opened successfully:
//
//      if (!inFile) {
//          cout << "Error opening file\n";
//      }
//
// ─────────────────────────────────────────────────────────────────────────
// FILE MODES
// ─────────────────────────────────────────────────────────────────────────
//
//   ios::in        → read
//   ios::out       → write
//   ios::app       → append to file
//   ios::ate       → move pointer to end on open
//   ios::trunc     → delete previous content
//   ios::binary    → binary mode
//
//   Example:
//
//      ofstream file("out.txt", ios::app);
//
// ─────────────────────────────────────────────────────────────────────────
// WRITING TO FILE
// ─────────────────────────────────────────────────────────────────────────
//
//   Use the same operators as cout:
//
//      ofstream out("file.txt");
//      out << "Hello\n";
//      out << 42;
//
// ─────────────────────────────────────────────────────────────────────────
// READING FROM FILE
// ─────────────────────────────────────────────────────────────────────────
//
//   Similar to cin:
//
//      ifstream in("file.txt");
//      int x;
//      in >> x;
//
//   For full lines:
//
//      getline(in, line);
//
// ─────────────────────────────────────────────────────────────────────────
// FILE CLOSE
// ─────────────────────────────────────────────────────────────────────────
//
//   file.close();
//
//   Files close automatically when the object goes out of scope,
//   but closing manually is good practice.
//
// ─────────────────────────────────────────────────────────────────────────
// COMMON FILE STREAM STATE FLAGS
// ─────────────────────────────────────────────────────────────────────────
//
//   file.good()   → no errors
//   file.eof()    → end of file reached
//   file.fail()   → logical error
//   file.bad()    → serious error
//
// =============================================================================

#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Writing to a file
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Writing to file ===\n";

    ofstream outFile("example.txt");

    if (!outFile) {
        cout << "Error opening file for writing\n";
        return 1;
    }

    outFile << "Hello from C++ file IO\n";
    outFile << "Number: " << 42 << "\n";
    outFile << "Another line\n";

    outFile.close();

    cout << "File written successfully\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // 2. Reading from a file
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Reading from file ===\n";

    ifstream inFile("example.txt");

    if (!inFile) {
        cout << "Error opening file for reading\n";
        return 1;
    }

    string line;

    while (getline(inFile, line)) {
        cout << line << "\n";
    }

    inFile.close();

    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // 3. Appending to a file
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Appending to file ===\n";

    ofstream appendFile("example.txt", ios::app);

    appendFile << "Appended line\n";

    appendFile.close();

    cout << "Line appended\n\n";


    // ─────────────────────────────────────────────────────────────────────────
    // 4. Using fstream (read + write)
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== fstream read/write ===\n";

    fstream file("numbers.txt", ios::out);

    if (!file) {
        cout << "Error creating numbers file\n";
        return 1;
    }

    for (int i = 1; i <= 5; i++) {
        file << i * 10 << "\n";
    }

    file.close();


    // reopen for reading
    file.open("numbers.txt", ios::in);

    int value;

    while (file >> value) {
        cout << "Read: " << value << "\n";
    }

    file.close();

    cout << "\n";


    // ─────────────────────────────────────────────────────────────────────────
    // 5. Reading word by word
    // ─────────────────────────────────────────────────────────────────────────

    cout << "=== Word by word reading ===\n";

    ifstream wordFile("example.txt");

    string word;

    while (wordFile >> word) {
        cout << word << "\n";
    }

    wordFile.close();


    return 0;
}

// =============================================================================
// SUMMARY
// =============================================================================
//
//   WRITE FILE
//      ofstream out("file.txt");
//      out << data;
//
//   READ FILE
//      ifstream in("file.txt");
//      in >> data;
//
//   READ LINE
//      getline(in, line);
//
//   APPEND
//      ofstream file("file.txt", ios::app);
//
//   READ + WRITE
//      fstream file("file.txt", ios::in | ios::out);
//
// =============================================================================
