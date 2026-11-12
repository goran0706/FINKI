#include<iostream>
#include<cstring>

using namespace std;

enum Extension {
	pdf, txt, exe
};

class File {
private:
	char *name;
	Extension Ext;
	char *owner;
	int size;

public:
	File() {
		name = nullptr;
		owner = nullptr;
		size = 0;
		Ext = txt;
	}

	File(const char *name, const char *owner, const int size, const Extension Ext) {
		this->name = new char[strlen(name) + 1];
		strcpy(this->name, name);
		this->Ext = Ext;
		this->owner = new char[strlen(owner) + 1];
		strcpy(this->owner, owner);
		this->size = size;
	}

	File(const File &f) {
		this->name = new char[strlen(f.name) + 1];
		strcpy(this->name, f.name);
		this->Ext = f.Ext;
		this->owner = new char[strlen(f.owner) + 1];
		strcpy(this->owner, f.owner);
		this->size = f.size;
	}

	~File() {
		delete [] name;
		delete [] owner;
	}

	File &operator=(const File &f) {
		if (this != &f) {
			delete [] name;
			delete [] owner;
			this->name = new char[strlen(f.name) + 1];
			strcpy(this->name, f.name);
			this->Ext = f.Ext;
			this->owner = new char[strlen(f.owner) + 1];
			strcpy(this->owner, f.owner);
			this->size = f.size;
		}
		return *this;
	}

	void print() const {
		cout << "File name: " << name << ".";
		if (Ext == 0) {
			cout << "pdf";
		} else if (Ext == 1) {
			cout << "txt";
		} else if (Ext == 2) {
			cout << "exe";
		}
		cout << endl;
		cout << "File owner: " << owner << endl;
		cout << "File size: " << size << endl;
	}

	bool equals(const File &that) {
		if (strcmp(this->name, that.name) == 0 && this->Ext == that.Ext && strcmp(this->owner, that.owner) == 0) {
			return true;
		}
		return false;
	}

	bool equalsType(const File &that) {
		if (strcmp(this->name, that.name) == 0 && this->Ext == that.Ext) {
			return true;
		}
		return false;
	}
};

class Folder {
private:
	char *name;
	int n;
	File *files;

public:
	Folder(const char *name) {
		this->name = new char[strlen(name) + 1];
		strcpy(this->name, name);
		n = 0;
		files = new File[n];
	}

	~Folder() {
		delete [] files;
	}

	Folder &add(const File &file) {
		File *temp = new File [n + 1];
		for (int i = 0; i < n; i++) {
			temp[i] = files[i];
		}
		temp[n] = file;
		delete [] files;
		files = temp;
		n++;
		return *this;
	}

	void print() const {
		cout << "Folder name: " << name << endl;
		for (int i = 0; i < n; i++) {
			files[i].print();
		}
	}

	void remove(const File &file) {
		int index = 0;
		for (int i = 0; i < n; i++) {
			if (files[i].equals(file)) {
				index = i;
				break;
			}
		}
		for (int i = index; i < n - 1; i++) {
			files[i] = files[i + 1];
		}
		n--;
	}
};


int main() {
	char fileName[20];
	char fileOwner[20];
	int ext;
	int fileSize;

	int testCase;
	cin >> testCase;
	if (testCase == 1) {
		cout << "======= FILE CONSTRUCTORS AND = OPERATOR =======" << endl;
		cin >> fileName;
		cin >> fileOwner;
		cin >> fileSize;
		cin >> ext;

		File created = File(fileName, fileOwner, fileSize, (Extension) ext);
		File copied = File(created);
		File assigned = created;

		cout << "======= CREATED =======" << endl;
		created.print();
		cout << endl;
		cout << "======= COPIED =======" << endl;
		copied.print();
		cout << endl;
		cout << "======= ASSIGNED =======" << endl;
		assigned.print();
	} else if (testCase == 2) {
		cout << "======= FILE EQUALS & EQUALS TYPE =======" << endl;
		cin >> fileName;
		cin >> fileOwner;
		cin >> fileSize;
		cin >> ext;

		File first(fileName, fileOwner, fileSize, (Extension) ext);
		first.print();

		cin >> fileName;
		cin >> fileOwner;
		cin >> fileSize;
		cin >> ext;

		File second(fileName, fileOwner, fileSize, (Extension) ext);
		second.print();

		cin >> fileName;
		cin >> fileOwner;
		cin >> fileSize;
		cin >> ext;

		File third(fileName, fileOwner, fileSize, (Extension) ext);
		third.print();

		bool equals = first.equals(second);
		cout << "FIRST EQUALS SECOND: ";
		if (equals)
			cout << "TRUE" << endl;
		else
			cout << "FALSE" << endl;

		equals = first.equals(third);
		cout << "FIRST EQUALS THIRD: ";
		if (equals)
			cout << "TRUE" << endl;
		else
			cout << "FALSE" << endl;

		bool equalsType = first.equalsType(second);
		cout << "FIRST EQUALS TYPE SECOND: ";
		if (equalsType)
			cout << "TRUE" << endl;
		else
			cout << "FALSE" << endl;

		equalsType = second.equals(third);
		cout << "SECOND EQUALS TYPE THIRD: ";
		if (equalsType)
			cout << "TRUE" << endl;
		else
			cout << "FALSE" << endl;
	} else if (testCase == 3) {
		cout << "======= FOLDER CONSTRUCTOR =======" << endl;
		cin >> fileName;
		Folder folder(fileName);
		folder.print();
	} else if (testCase == 4) {
		cout << "======= ADD FILE IN FOLDER =======" << endl;
		char name[20];
		cin >> name;
		Folder folder(name);

		int iter;
		cin >> iter;

		while (iter > 0) {
			cin >> fileName;
			cin >> fileOwner;
			cin >> fileSize;
			cin >> ext;

			File file(fileName, fileOwner, fileSize, (Extension) ext);
			folder.add(file);
			iter--;
		}
		folder.print();
	} else {
		cout << "======= REMOVE FILE FROM FOLDER =======" << endl;
		char name[20];
		cin >> name;
		Folder folder(name);

		int iter;
		cin >> iter;

		while (iter > 0) {
			cin >> fileName;
			cin >> fileOwner;
			cin >> fileSize;
			cin >> ext;

			File file(fileName, fileOwner, fileSize, (Extension) ext);
			folder.add(file);
			iter--;
		}
		cin >> fileName;
		cin >> fileOwner;
		cin >> fileSize;
		cin >> ext;

		File file(fileName, fileOwner, fileSize, (Extension) ext);
		folder.remove(file);
		folder.print();
	}
	return 0;
}
