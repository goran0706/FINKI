// Define a classDonationAction that stores information for:
//
//     name (dynamically allocated array of chars),
//     id number (char array),
//     collected fund value (integer),
//     needed fund value (integer)
//
// For this class implement (15 points):
//
//     constructors, destructor and the needed get-functions (see the main function for calls)
//
//     operator<< for printing the data in the following format:
//
//     idnumber name X more denars are needed, if the needed fund is not collected, where X=neededfundvalue – collectedfundvalue
//
//     idnumber name collected, if the needed fund is collected
//
//     operator+= - to add a given integer to the collected fund value
//     operator < - to compare two donation actions by the needed fund value that is not collected (the difference between the needed and collected fund value). If two donation actions are needed the same fund value, the actions are compared by their id number.
//
// The id number must be string with at most 9 digits. In this class an exception should be thrown if there is an error in the id number. Two types of errors can be found: the id number contains characters that are not digits or the id number could have more than 9 digits. In the main function write a code segment that will handle with these exceptions and write an appropriate message when an error occurs : The id number has a non-digit character or The id number has more than 9 characters, accordingly. If one id number has both types of error write the second message. (10 points)
//
// Define a class DonationSociety that stores information for:
//
//     name of the president of the society (char array, max 30)
//     dynamically allocated array of objects of class DonationAction
//     number of donation actions (integer)
//
// For this class implement (25 points):
//
//     constructs and desctructor (see the calls in the main function)
//     functionbool takeDonation (char id[], int donatedFund) that takes donatedFund for the donation action with an id number id. The function will return true if the donation is taken. The donation will be taken if the assigned id number exists and in this case the value for the collected fund of the action with the given id will be updated.
//     operator+= to add a new donation action in the array of donation actions, but only if there does not already exists a donation actions with the same id number. In all other cases the donation actions is not added.
//
//     operator<< for printing the all donation actions sorted in decreasing order according to the comparison defined with the operator <. In the end, in the last row print:
//
//     President: name
//
// For example:
// Input 	Result
//
// 3
// donate lunch
// 12345678
// 450
// child smile
// 123
// 30000
// gift a card
// aa11111111111111
// 599
// 2
// 1234 499
// 123 40000
//
//
//
// The id number has more than 9 characters
// The donation is not taken. Wrong ID.
// ===============
// 12345678 donate lunch 450 more denars are needed
// 123 child smile collected
// President:Velko Velkovski

#include<iostream>

//your code

int main() {
    DonaciskoDurstvo donacii("Velko Velkovski");
    int n;
    char naziv[50], id[50];
    int potrebnasuma, doniranasuma;
    cin >> n;

    for (int i = 0; i < n; i++) {
        cin.get();
        cin.getline(naziv, 50);
        cin >> id >> potrebnasuma;

        DonaciskiApel edna(naziv, id, potrebnasuma);
        donacii += edna;
    }

    //donation
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> id >> doniranasuma;

        if (!donacii.primiiDonacija(id, doniranasuma))
            cout << "The donation is not taken. Wrong ID." << endl;
    }
    cout << "===============" << endl;
    cout << donacii;
}
