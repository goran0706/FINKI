// Да се дефинира класа AIModel која ќе претставува еден AI модел. Треба да ги содржи следните полиња:
//
// brand - компанија-производител на моделот,
// name - име на моделот и
// version - верзија на моделот.
//
// За класата треба да се дефинира параметризиран конструктор и print() метод.
// Да се дефинира класа AIConfiguration, која ќе ги претставува конфигурациите на AI модел.
// Таа треба да ги содржи следните полиња:
//
// parameters - број на влезни параметри на моделот,
// epochs - број на епохи на кои е трениран моделот,
// type - податок од тип AIModelType (GPT, VISION, CLASSIFIER, EMBEDDING)
// За класата треба да се дефинира параметризиран конструктор и print() метод.
// Во параметризираниот конструктор треба да се провери валидноста на бројот на параметри и типот,
// и доколку се наиде на невалиден податок да се фрли соодветен исклучок
// (треба да ги креирате класите InvalidNumberOfParametersException и InvalidModelTypeException, соодветно).
//
// За бројот на параметри велиме дека е невалиден доколку е број помал од 0.
// За типот на моделот велиме дека е невалиден доколку не е дефиниран во енумерацијата.
//
// Напомена: прво се проверува бројот на параметри, па потоа типот на модел.
// Исклучоците треба да се фатат на означеното место во main функцијата.*/

#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

// TODO: AIModelType
// TODO: Exceptions
// TODO: Classes

/**

Converts a string representation of an AI model type to its corresponding AIModelType enum value.,
If the input string does not match any known type, the function returns an invalid value (-1 cast to AIModelType).*,
@param typeStr A string representing the AI model type.,
@return AIModelType The corresponding enum value if found, or static_cast<AIModelType>(-1) if the input is invalid.**/,
AIModelType getStringMapping(string typeStr)
{
    unordered_map<string, AIModelType> mapping = {
            {"GPT", GPT},
            {"VISION", VISION},
            {"CLASSIFIER", CLASSIFIER},
            {"EMBEDDING", EMBEDDING}};

    if (mapping.find(typeStr) != mapping.end())
    {
        return mapping[typeStr];
    }
    else
    {
        return static_cast<AIModelType>(-1); // Invalid type
    }
}

// COMPLETE TODOs
int main()
{
    int tc;
    cin >> tc;
    if (tc == 1)
    {
        string brand, name, version;
        cout << "Testing AI Model Creation:";
        cin >> brand >> name >> version;
        AIModel model(brand, name, version);
        cout << " PASSED" << endl;
    }
    if (tc == 2)
    {
        AIModel model("OpenAI", "GPT-3", "v1.0");
        cout << "Testing Print Method for AI Model:" << endl;
        model.print();
    }
    if (tc == 3)
    {
        cout << "Testing AI Configuration Creation:";
        int parameters, epochs;
        string typeStr;
        cin >> parameters >> epochs >> typeStr;
        AIModelType type = getStringMapping(typeStr);
        AIConfiguration config(parameters, epochs, type);
        cout << " PASSED" << endl;
    }
    if (tc == 4)
    {
        cout << "Testing Print Method for AI Configuration:" << endl;
        int parameters = 10, epochs = 5;
        string typeStr = "GPT";
        AIModelType type = getStringMapping(typeStr);
        AIConfiguration config(parameters, epochs, type);
        config.print();
    }

    if (tc == 5)
    {
        cout << "Testing Invalid Number of Parameters Exception:" << endl;
        int parameters, epochs;
        string typeStr = "GPT";
        cin >> parameters >> epochs;
        AIModelType type = getStringMapping(typeStr);
        AIConfiguration config(parameters, epochs, type);
        config.print();

    }
    if (tc == 6)
    {
        cout << "Testing Invalid Model Type Exception:" << endl;
        int parameters = 10, epochs = 5;
        string typeStr;
        cin >> typeStr;
        AIModelType type = getStringMapping(typeStr);
        AIConfiguration config(parameters, epochs, type);
        config.print();
    }
    return 0;
}