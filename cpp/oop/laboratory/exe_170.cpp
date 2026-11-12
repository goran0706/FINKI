// Да се дефинира класа Flight за која ќе се чуваат:
//   - динамички алоцирана низа од карактери за бројот на летот (пр. "AA101")
//   - низа од максимум 30 карактери за дестинацијата (пр. "London", "Paris")
//   - растојание во километри (int)
//   - број на патници (int)
//
// За потребите на класата да се дефинираат:
//   - default конструктор и конструктор со аргументи
//   - copy constructor и оператор =
//   - деструктор
//   - метод fuelCost() кој го враќа трошокот на гориво, пресметан како:
//       растојание * 2.5 + број на патници * 0.8
//   - метод print() кој го печати летот во следниот формат:
//
//       БројНаЛет -> Дестинација
//       Distance: растојание km
//       Passengers: патници
//       Fuel Cost: трошок
//
//
// Од класата Flight да се изведе класата CharteredFlight за која дополнително
// ќе се чуваат:
//   - низа од максимум 50 карактери за името на компанијата-закупувач
//   - цена на закуп во USD (double)
//   - дали летот е приватен - true/false (bool)
//
// За потребите на класата да се дефинираат:
//   - default конструктор
//   - конструктор кој прима објект од Flight и дополнителните информации
//   - конструктор кој ги прима сите аргументи
//   - copy constructor, оператор =, деструктор
//   - метод charterCost() кој го враќа вкупниот трошок на чартерот, пресметан
//     како:
//       ако е приватен:  fuelCost() * 3.0 + цена на закуп
//       ако не е приватен: fuelCost() * 1.5 + цена на закуп
//   - да се препокријат методите:
//       fuelCost() -- враќа просек од Flight::fuelCost() и charterCost()
//       print()    -- покрај основните информации, печати и:
//
//           Company: компанија
//           Charter Price: цена
//           Private: Yes / No
//           Charter Cost: charterCost
//           Total Cost: новиот fuelCost
//
// -----
//
// Define a class Flight that will store:
//   - a dynamically allocated character array for the flight number (e.g. "AA101")
//   - a character array of maximum 30 characters for the destination (e.g. "London", "Paris")
//   - distance in kilometres (int)
//   - number of passengers (int)
//
// The following must be defined for the class:
//   - default constructor and parameterized constructor
//   - copy constructor and assignment operator =
//   - destructor
//   - method fuelCost() that returns the fuel cost, calculated as:
//       distance * 2.5 + passengers * 0.8
//   - method print() that prints the flight in the following format:
//
//       FlightNo -> Destination
//       Distance: distance km
//       Passengers: passengers
//       Fuel Cost: cost
//
//
// Derive the class CharteredFlight from Flight. It additionally stores:
//   - a character array of maximum 50 characters for the name of the chartering company
//   - charter price in USD (double)
//   - whether the flight is private - true/false (bool)
//
// The following must be defined for the class:
//   - default constructor
//   - constructor that takes a Flight object and the additional information
//   - constructor that takes all arguments
//   - copy constructor, assignment operator =, destructor
//   - method charterCost() that returns the total charter cost, calculated as:
//       if private:     fuelCost() * 3.0 + charter price
//       if not private: fuelCost() * 1.5 + charter price
//   - override the following methods:
//       fuelCost() -- returns the average of Flight::fuelCost() and charterCost()
//       print()    -- in addition to the base information, also prints:
//
//           Company: company
//           Charter Price: price
//           Private: Yes / No
//           Charter Cost: charterCost
//           Total Cost: new fuelCost
//
// For example:
// Input 	Result
//
// 1
// AA101 London 1500 180
// LH202 Paris 1200 210
// TK303 Istanbul 2100 290
// EK404 Dubai 5500 410
// QR505 Doha 4800 370
//
//
//
// FLIGHTS:
// =====================================
// AA101 -> London
// Distance: 1500 km
// Passengers: 180
// Fuel Cost: 3894
// LH202 -> Paris
// Distance: 1200 km
// Passengers: 210
// Fuel Cost: 3168
// TK303 -> Istanbul
// Distance: 2100 km
// Passengers: 290
// Fuel Cost: 5482
// EK404 -> Dubai
// Distance: 5500 km
// Passengers: 410
// Fuel Cost: 14078
// QR505 -> Doha
// Distance: 4800 km
// Passengers: 370
// Fuel Cost: 12296

int main() {
    char flightNo[100], destination[30], company[50];
    int distance, passengers;
    double charterPrice;
    bool isPrivate;
    int n;
    cin >> n;

    Flight *flights = new Flight[5];
    CharteredFlight *cFlights = new CharteredFlight[5];

    if (n == 1) {
        cout << "FLIGHTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            cin >> flightNo >> destination >> distance >> passengers;
            flights[i] = Flight(flightNo, destination, distance, passengers);
            flights[i].print();
        }
    } else if (n == 2) {
        for (int i = 0; i < 5; ++i) {
            cin >> flightNo >> destination >> distance >> passengers;
            cin >> company >> charterPrice >> isPrivate;
            flights[i] = Flight(flightNo, destination, distance, passengers);
            cFlights[i] = CharteredFlight(flights[i], company, charterPrice, isPrivate);
        }
        cout << "FLIGHTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            flights[i].print();
        cout << "CHARTERED FLIGHTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            cFlights[i].print();
    } else if (n == 3) {
        for (int i = 0; i < 5; ++i) {
            cin >> flightNo >> destination >> distance >> passengers;
            cin >> company >> charterPrice >> isPrivate;
            cFlights[i] = CharteredFlight(flightNo, destination, distance, passengers,
                                          company, charterPrice, isPrivate);
        }
        cout << "CHARTERED FLIGHTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            cFlights[i].print();
    }

    delete [] flights;
    delete [] cFlights;
    return 0;
}
