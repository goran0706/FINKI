// Да се дефинира класа Scientist за која ќе се чуваат:
//
// динамички алоцирана низа од карактери за името на научникот
// низа од максимум 50 карактери за институцијата каде што работи
// вкупен број објавени трудови (int)
// вкупен број цитати од тие трудови (int)
// вкупен број години истражувачка работа (int)
//
// За потребите на класата да се дефинираат:
//
// default конструктор и конструктор со аргументи
// copy constructor и оператор =
// деструктор
// метод impact() кој го враќа научниот импакт според формулата: (цитати * 0.5 + трудови * 0.3 + години * 0.2)
// метод print() кој печати:
// Name: <име> - Institution: <институција>
// Publications: <трудови>
// Citations: <цитати>
// Experience: <години>
// Impact Score: <импакт>
//
// Од класата Scientist да се изведе ResearchScientist, за која дополнително се чуваат:
//
// вкупен број објавени трудови во реномирани списанија (Q1) (int)
// вкупен број проекти финансирани од Европска Унија (int)
// вкупна добиена сума од проекти во евра (double)
//
// Да се дефинираат:
// default конструктор
// конструктор со Scientist + нови аргументи
// конструктор со сите аргументи
// copy constructor, оператор =, деструктор
// метод researchImpact() кој се пресметува како: (Q1 * 0.4 + проекти * 0.2 + добиена сума/10000 * 0.4)
//
// Да се препокријат:
//
// impact() – враќа просек од обичниот импакт и researchImpact()
// print() – печати :
// Q1 Publications: <број>
// EU Projects: <број>
// Total Funding: <сума>
// Research Impact: <impact>
// Overall Impact: <просек>
//
// Да се дефинира глобална функција void printHighestImpact(Scientist* scientists, int count) која го наоѓа научникот со најголем импакт.
#include <iostream>
#include <cstring>
using namespace std;

class Scientist {
protected:
    char *name;
    char institution[50];
    int papers;
    int citations;
    int experience;

public:
    explicit Scientist(const char *name = "", const char *institution = "", const int papers = 0,
                       const int citations = 0,
                       const int experience = 0) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        strcpy(this->institution, institution);
        this->papers = papers;
        this->citations = citations;
        this->experience = experience;
    }

    Scientist(const Scientist &other) {
        this->name = new char[strlen(other.name) + 1];
        strcpy(this->name, other.name);
        strcpy(this->institution, other.institution);
        this->papers = other.papers;
        this->citations = other.citations;
        this->experience = other.experience;
    }

    virtual ~Scientist() {
        delete[] name;
    }

    Scientist &operator=(const Scientist &other) {
        if (this != &other) {
            delete[] this->name;
            this->name = new char[strlen(other.name) + 1];
            strcpy(this->name, other.name);
            strcpy(this->institution, other.institution);
            this->papers = other.papers;
            this->citations = other.citations;
            this->experience = other.experience;
        }
        return *this;
    }

    virtual double impact() const {
        return citations * 0.5 + papers * 0.3 + experience * 0.2;
    }

    virtual void print() const {
        cout << name << " - " << institution << endl
                << "Publications: " << papers << endl
                << "Citations: " << citations << endl
                << "Experience (Years): " << experience << endl
                << "Impact Score: " << impact() << endl;
    }
};

class ResearchScientist final : public Scientist {
private:
    int q1_papers;
    int eu_projects;
    double earnings;

public:
    explicit ResearchScientist(const char *name = "", const char *institution = "", const int papers = 0,
                               const int citations = 0,
                               const int experience = 0, const int q1_papers = 0, const int eu_projects = 0,
                               const double earnings = 0.0)
        : Scientist(name, institution, papers, citations, experience) {
        this->q1_papers = q1_papers;
        this->eu_projects = eu_projects;
        this->earnings = earnings;
    }

    ResearchScientist(const ResearchScientist &other) : Scientist(other) {
        this->q1_papers = other.q1_papers;
        this->eu_projects = other.eu_projects;
        this->earnings = other.earnings;
    }

    ~ResearchScientist() override = default;

    ResearchScientist &operator=(const ResearchScientist &other) {
        if (this != &other) {
            Scientist::operator=(other);
            this->q1_papers = other.q1_papers;
            this->eu_projects = other.eu_projects;
            this->earnings = other.earnings;
        }
        return *this;
    }

    double researchImpact() const {
        return q1_papers * 0.4 + eu_projects * 0.2 + ((earnings / 10000) * 0.4);
    }

    double impact() const override {
        return (Scientist::impact() + researchImpact()) / 2;
    }

    void print() const override {
        Scientist::print();
        cout << "Q1 Publications: " << q1_papers << endl
                << "EU Projects: " << eu_projects << endl
                << "Total Funding: " << earnings << " EUR" << endl
                << "Research Impact: " << researchImpact() << endl
                << "Overall Impact: " << impact() << endl;
    }
};

void printHighestImpact(Scientist *scientists, int count) {
    int index = 0;
    for (int i = 1; i < count; i++) {
        if (scientists[i].impact() > scientists[index].impact()) {
            index = i;
        }
    }
    cout << "Scientist with the Highest Impact:" << endl;
    scientists[index].print();
}

int main() {
    int n;
    cin >> n;

    if (n == 1) {
        // Test Scientist (Basic)
        int numScientists;
        cin >> numScientists;

        Scientist *scientists = new Scientist[numScientists];

        for (int i = 0; i < numScientists; ++i) {
            char name[100], institution[50];
            int publications, citations, years;
            cin >> name >> institution >> publications >> citations >> years;

            scientists[i] = Scientist(name, institution, publications, citations, years);
        }

        cout << "SCIENTISTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < numScientists; ++i) {
            scientists[i].print();
            cout << "-------------------------" << endl;
        }

        // Copy Constructor Test
        cout << "Testing Copy Constructor:" << endl;
        Scientist copiedScientist = scientists[0];
        copiedScientist.print();

        // Assignment Operator Test
        cout << "Testing Assignment Operator:" << endl;
        Scientist assignedScientist;
        assignedScientist = scientists[1];
        assignedScientist.print();

        delete[] scientists;
    } else if (n == 2) {
        // Test ResearchScientist
        int numScientists;
        cin >> numScientists;

        ResearchScientist *scientists = new ResearchScientist[numScientists];

        for (int i = 0; i < numScientists; ++i) {
            char name[100], institution[50];
            int publications, citations, years, Q1publications, EUprojects;
            double funding;

            cin >> name >> institution >> publications >> citations >> years;
            cin >> Q1publications >> EUprojects >> funding;

            scientists[i] = ResearchScientist(name, institution, publications, citations, years, Q1publications,
                                              EUprojects, funding);
        }

        cout << "RESEARCH SCIENTISTS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < numScientists; ++i) {
            scientists[i].print();
            cout << "-------------------------" << endl;
        }

        // Copy Constructor Test
        cout << "Testing Copy Constructor:" << endl;
        ResearchScientist copiedResearchScientist = scientists[0];
        copiedResearchScientist.print();

        // Assignment Operator Test
        cout << "Testing Assignment Operator:" << endl;
        ResearchScientist assignedResearchScientist;
        assignedResearchScientist = scientists[1];
        assignedResearchScientist.print();

        delete[] scientists;
    } else if (n == 3) {
        // Test printing scientist with highest impact
        int numScientists;
        cin >> numScientists;

        Scientist *scientists = new Scientist[numScientists];

        for (int i = 0; i < numScientists; ++i) {
            char name[100], institution[50];
            int publications, citations, years;
            cin >> name >> institution >> publications >> citations >> years;

            scientists[i] = Scientist(name, institution, publications, citations, years);
        }

        printHighestImpact(scientists, numScientists);
        delete[] scientists;
    }

    return 0;
}
