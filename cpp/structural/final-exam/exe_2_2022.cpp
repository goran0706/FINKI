// 2. Да се прочитаат знаци од датотека и броевите да се заменат со букви:
// Парен број = X
// Непарен број = Y

#include <iostream> // Required for standard input/output streams (cin, cout, cerr)
#include <fstream>  // Required for file stream classes (ifstream, ofstream)
#include <cctype>   // Required for character handling functions (isdigit)
#include <filesystem>
using namespace std;

constexpr char READ_FILE[] = "0_read_file.txt";
constexpr char WRITE_FILE[] = "0_write_file.txt";

int main() {
	// Step 1: Open the file stream (ifstream/ofstream)
	ifstream inFile(READ_FILE);

	// Step 2: Validate file opened successfully (Robustness check)
	if (!inFile) {
		cerr << "Failed to open the file" << endl;
		return 1;
	}

	// Step 3: Process the data (Read/Write loop)
	char ch; // For character-by-character extraction using file.get(ch)
	char word[50]; // For word-by-word extraction using file >> word
	char str[1000]; // For line-by-line extraction using file.getline(str, size)

	// --- STREAM EXTRACTION RULES FOR EXAMS ---
	// CLI INPUT:
	// >> operator    -> Reads stream, skips leading whitespace, and STOPS at any whitespace (space, tab, newline).
	// cin.get(ch)    -> Reads exactly ONE character, including spaces and newlines.
	// cin.getline()  -> Reads a full line of text until it hits a newline character ('\n').

	// FILE INPUT:
	// >> operator    -> Reads stream, skips leading whitespace, and STOPS at any whitespace (space, tab, newline).
	// file.get(ch)   -> Reads exactly ONE character, including spaces, tabs, and newlines.
	// file.getline() -> Reads a full line until '\n', removes '\n' from stream, appends '\0'.
	// file.read()    -> Binary/block read. Extracts a fixed number of bytes without appending a null terminator.

	// --- NOTES ---
	// In the loops below, only the FIRST loop will actually run.
	// Once a loop reaches the End-Of-File (EOF), the stream fails and stops.
	// To run subsequent loops in a real test, you must call: read_file.clear(); read_file.seekg(0);

	// Loop A: Character-by-character
	cout << "----- START OF LOOP A -----\n";
	while (inFile.get(ch)) {
		cout << ch;
	}
	inFile.clear();
	inFile.seekg(0);
	cout << "----- END OF LOOP A -----\n\n";


	// Loop B: Word-by-word (Skips spaces and newlines)
	cout << "----- START OF LOOP B -----\n";
	while (inFile >> word) {
		cout << word << " ";
	}
	inFile.clear();
	inFile.seekg(0);
	cout << "----- END OF LOOP B -----\n\n";


	// Loop C: Line-by-line (Preserves spaces, splits at newlines)
	cout << "----- START OF LOOP C -----\n";
	while (inFile.getline(str, 1000)) {
		cout << str << endl;
	}
	inFile.clear();
	inFile.seekg(0);
	cout << "----- END OF LOOP C -----\n\n";


	// Loop D: Fixed-block binary reading
	cout << "----- START OF LOOP D -----\n";
	// 1. Read up to 999 chars (leave 1 slot open for '\0')
	while (inFile.read(str, 999) || inFile.gcount() > 0) {
		// 2. Get the exact number of bytes successfully read
		int bytesRead = inFile.gcount();

		// 3. Manually seal the array right at the end of the real data
		str[bytesRead] = '\0';

		cout << str;
	}
	inFile.clear();
	inFile.seekg(0);
	cout << "----- END OF LOOP D -----\n\n";


	// ==================================================
	// TASK SOLUTION:
	// ==================================================
	int count = 0;
	char fileData[1000] = "";

	while (inFile.get(ch)) {
		if (isdigit(ch)) {
			fileData[count++] = ((ch - '0') % 2 == 0) ? 'X' : 'Y';
		} else {
			fileData[count++] = ch;
		}
	}
	fileData[count] = '\0';

	// Step 4: Close the file stream
	inFile.close();

	// 1. Open/Create the file stream
	filesystem::path filePath = filesystem::current_path() / WRITE_FILE;
	ofstream outFile(filePath);

	// 2. Robustness check
	if (!outFile) {
		cerr << "Failed to create the file" << endl;
		return 1;
	}

	// 3. Write data and close
	outFile << fileData;
	outFile.close();


	// ======================================================
	// TASK SOLUTION 2: Read & Write Immediately char-by-char
	// ======================================================
	ifstream input("./0_read_file.txt");
	ofstream output("./0_write_file.txt");

	if (!input) {
		cout << "Failed to read from file" << endl;
		return 0;
	}

	if (!output) {
		cout << "Failed to write to file" << endl;
		return 0;
	}

	char ch;
	while (input.get(ch)) {
		output.put(ch == 'i' ? '|' : ch);
	}

	input.close();
	output.close();

	return 0;
}
