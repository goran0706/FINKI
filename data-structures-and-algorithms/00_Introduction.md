# Вовед во Java

**Предмет:** Алгоритми и податочни структури

## 1. Зошто Java?

Java е објектно-ориентиран програмски јазик за општа намена, развиен во Sun Microsystems во 1995 година од James
Gosling.

Главни карактеристики:

- Се базира на концепти од C и C++.
- Првично е дизајниран за апликации поврзани со Web и Internet.
- Широко се користи за развој на различни видови софтвер.
- Овозможува независност од оперативниот систем преку Java платформата.

### 1.1. Предности

- **Едноставност:** отстранува дел од сложеноста на C++, вклучувајќи директно ракување со покажувачи.
- **Автоматско управување со меморијата:** Garbage Collection управува со меморијата за објектите што повеќе не се
  користат.
- **Библиотеки:** располага со богати предефинирани класи и методи.
- **Објектно-ориентиран пристап:** кодот се организира околу објекти и методи што работат со нивните податоци.
- **Повторна употреба на код:** објектно-ориентираната организација овозможува подобра структура и повторна употреба.

### 1.2. Недостатоци

Java може да има поголеми трошоци при извршувањето во споредба со програмските јазици што се преведуваат директно во
машински код. Сепак, брзината на извршување зависи од програмата, оптимизациите на JVM и околината во која се извршува.

## 2. Развојна околина

За развој на Java апликации е потребен **JDK (Java Development Kit)**.

Популарни развојни околини се:

- IntelliJ IDEA
- Eclipse
- NetBeans
- BlueJ
- jGRASP

Иако развојните околини се разликуваат по интерфејсот и функционалностите, основниот процес е ист:

1. Пишување на Java кодот.
2. Компајлирање на кодот.
3. Извршување на програмата.
4. Откривање и отстранување грешки.

### 2.1. Основен процес во IDE

Во развојна околина, типичниот процес е:

1. Креирање или отворање Java проект.
2. Креирање Java класа.
3. Пишување на кодот.
4. Компајлирање на кодот.
5. Извршување на програмата.
6. Дебагирање при појава на грешки.

## 3. Прва Java програма

Датотеката треба да се вика `Main.java`.

```java
public class Main {
    static void main(String[] args) {
        System.out.println("Hello World!"); // Result: Hello World!
    }
}
```

### 3.1. Објаснување

- `public class Main` декларира јавна класа со име `Main`.
- `public static void main(String[] args)` е стандардната влезна точка за извршување на Java апликацијата.
- `System.out.println()` печати текст на стандардниот излез и преминува во нов ред.
- `{}` ги означуваат блоковите на класата и методот.
- `;` го завршува изразот.

Во традиционална Java апликација, JVM започнува со извршување од соодветниот `main` метод.

### 3.2. Java е чувствителна на големи и мали букви

Java е *case-sensitive* јазик.

На пример, следните идентификатори се различни:

```java
public class Main {
    static void main(String[] args) {
        System.out.println("System");
        System.out.println("system");
        System.out.println("SyStEM");
    }
}
```

Името на јавната класа мора да одговара на името на датотеката. За примерот погоре, датотеката треба да се вика
`Main.java`.

## 4. Објектно-ориентирано програмирање

Java поддржува објектно-ориентирано програмирање (OOP).

Основните концепти вклучуваат:

- Класи и објекти.
- Атрибути и методи.
- Енкапсулација.
- Наследување.
- Полиморфизам.
- Апстракција.

Објектите се креираат со операторот `new`. За обични стринг-литерали, Java овозможува и поедноставна форма:

```java
public class Main {
    static void main(String[] args) {
        String text = "Hello!";

        System.out.println(text); // Result: Hello!
    }
}
```

### 4.1. Примитивни и референтни типови

Java има осум примитивни типови:

| Тип       | Опис                              |
|-----------|-----------------------------------|
| `boolean` | Логичка вредност                  |
| `byte`    | 8-битен цел број                  |
| `char`    | UTF-16 кодна единица              |
| `short`   | 16-битен цел број                 |
| `int`     | 32-битен цел број                 |
| `long`    | 64-битен цел број                 |
| `float`   | 32-битен број со подвижна запирка |
| `double`  | 64-битен број со подвижна запирка |

Референтните типови вклучуваат класи, интерфејси и низи.

Референтна променлива може да има вредност `null`, што значи дека не упатува на објект.

```java
public class Main {
    static void main(String[] args) {
        int age = 20;
        double average = 8.75;
        boolean active = true;

        String name = "Ana";
        String address = null;

        System.out.println(age);      // Result: 20
        System.out.println(average);  // Result: 8.75
        System.out.println(active);   // Result: true
        System.out.println(name);     // Result: Ana
        System.out.println(address);  // Result: null
    }
}
```

### 4.2. Управување со меморијата

Java користи **Garbage Collection (GC)** за автоматско ослободување меморија за објекти што повеќе не се достапни преку
активни референци.

Програмерот обично не мора рачно да ја ослободува меморијата на објектите, како што се прави во некои други програмски
јазици.

Сепак, Garbage Collection не значи дека програмата не може да има проблеми со меморијата. На пример, непотребно задржани
референци можат да спречат ослободување меморија.

## 5. Java API и пакети

**Java API (Application Programming Interface)** е збир од предефинирани класи, интерфејси и методи што може да се
користат во Java програмите.

Пакетите ги организираат сродните класи и интерфејси.

Примери за функционалности што ги нуди Java API:

- Математички пресметки.
- Работа со текст.
- Влез и излез.
- Работа со датотеки.
- Колекции и структури на податоци.
- Мрежна комуникација.
- Обработка на грешки.

Пример за користење класа од пакет:

```java
import java.util.Scanner;

public class Main {
    static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.println("Hello, " + name); // Result: Hello, Ana (if Ana is entered)

        input.close();
    }
}
```

`import java.util.Scanner;` ја прави класата `Scanner` достапна преку нејзиното кратко име во кодот.

## 6. Влез и излез

### 6.1. Печатење на екран

За печатење се користат методите `System.out.print()` и `System.out.println()`.
`println()` печати текст и преминува во нов ред, додека `print()` не додава нов ред автоматски.

```java
public class Main {
    static void main(String[] args) {
        System.out.print("Java programming is interesting.");
        System.out.println(" Java programming is interesting.");
        // Result: Java programming is interesting. Java programming is interesting.

        System.out.println("Java programming is interesting.");
        System.out.print("Java programming is interesting.");
        // Result: 
        // Java programming is interesting. 
        // Java programming is interesting.
    }
}
```

### 6.2. Печатење променливи

Операторот `+` може да се користи за спојување текст и вредности.

```java
public class Main {
    static void main(String[] args) {
        int number = 10;

        System.out.println("Number = " + number); // Result: Number = 10
    }
}
```

Друг пример:

```java
public class Main {
    static void main(String[] args) {
        String name = "Ana";

        System.out.println("Hello, " + name); // Result: Hello, Ana
    }
}
```

### 6.3. Читање влез со `Scanner`

За читање податоци од тастатура се користи класата `Scanner` од пакетот `java.util`.

**Важни методи:**

- `nextInt()` — чита цел број.
- `nextDouble()` — чита број со децимали.
- `next()` — чита еден токен, до празно место.
- `nextLine()` — ја чита преостанатата содржина од тековната линија.

```java
import java.util.Scanner;

public class Main {
    static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter an integer: ");
        int number = input.nextInt();

        System.out.println("You entered " + number); // Result: You entered 42 (if 42 is entered)

        input.close();
    }
}
```

Со користење на `try-with-resources`.

```java
import java.util.Scanner;

public class Main {
    static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.print("Enter an integer: ");
            int number = input.nextInt();

            System.out.println("You entered " + number);
            // Result: You entered 42 (if 42 is entered)
        }
    }
}
```

### 6.4. Читање цела линија

`nextLine()` ја чита целата линија до знакот за нов ред.

```java
import java.util.Scanner;

public class Main {
    static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.println("Hello, " + name); // Result: Hello, Ana (if Ana is entered)

        input.close();
    }
}
```

**Внимание:** ако претходно се користи `nextInt()` или друг метод што не ја чита целата линија, следниот повик на
`nextLine()` може да го прочита преостанатиот знак за нов ред. Во такви случаи, понекогаш е потребен дополнителен повик
на `nextLine()`.

Пример:

```java
import java.util.Scanner;

public class Main {
    static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter your age: ");
        int age = input.nextInt();

        input.nextLine(); // Consume the remaining newline.

        System.out.print("Enter your name: ");
        String name = input.nextLine();

        System.out.println("Age: " + age);    // Result: Age: 20 (if 20 is entered)
        System.out.println("Name: " + name);  // Result: Name: Ana (if Ana is entered)

        input.close();
    }
}
```

## 7. Контрола на текот

Контролните структури одредуваат кои наредби ќе се извршат и колку пати ќе се повторуваат.

### 7.1. `if` и `else`

```java
public class Main {
    static void main(String[] args) {
        int number = 7;

        if (number % 2 == 0) {
            System.out.println("Even"); // Result when number is even: Even
        } else {
            System.out.println("Odd");  // Result: Odd
        }
    }
}
```

Операторот `%` го пресметува остатокот од делењето. Ако остатокот при делење со `2` е `0`, бројот е парен.

### 7.2. `for` циклус

Основна структура:

```
for (initialization; condition; update) {
    // Наредби што се повторуваат
}
```

Пример:

```java
public class Main {
    static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println(i); // Result: 0, 1, 2, 3, 4 (each on a separate line)
        }
    }
}
```

Циклусот печати броеви од `0` до `4`.

### 7.3. `for-each` циклус

`for-each` се користи за поминување низ елементите на низа или колекција.

```java
public class Main {
    static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40};

        for (int number : numbers) {
            System.out.println(number); // Result: 10, 20, 30, 40 (each on a separate line)
        }
    }
}
```

Променливата `number` ја добива вредноста на секој елемент при секоја итерација.

### 7.4. `while` циклус

Основна структура:

```
while(condition){
  // Наредби што се повторуваат
}
```

Пример:

```java
public class Main {
    static void main(String[] args) {
        int i = 0;

        while (i < 5) {
            System.out.println(i); // Result: 0, 1, 2, 3, 4 (each on a separate line)
            i++;
        }
    }
}
```

Условот се проверува пред секоја итерација. Ако е неточен од почеток, телото нема да се изврши ниту еднаш.

### 7.5. `do-while` циклус

Основна структура:

```
do{
  // Наредби што се повторуваат
}while(condition);
```

Пример:

```java
public class Main {
    static void main(String[] args) {
        int i = 0;

        do {
            System.out.println(i); // Result: 0, 1, 2, 3, 4 (each on a separate line)
            i++;
        } while (i < 5);
    }
}
```

Кај `do-while`, телото се извршува најмалку еднаш, бидејќи условот се проверува на крајот.

## 8. Наследување и композиција

### 8.1. Наследување

Наследувањето овозможува една класа да ги наследи достапните членови од друга класа и да додаде сопствени
карактеристики.

Во Java:

- Класата што наследува се нарекува **поткласа** (*subclass*).
- Класата од која се наследува се нарекува **суперкласа** (*superclass*).
- Клучниот збор `extends` се користи за наследување.
- Класите поддржуваат единечно наследување: една класа може директно да наследува од една друга класа.
- Интерфејсите овозможуваат дефинирање договори што класа може да ги имплементира.

Пример:

```java
class Animal {
    public void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println("Woof!");
    }
}

public class Main {
    static void main(String[] args) {
        Dog dog = new Dog();

        dog.makeSound(); // Result: Some sound
        dog.bark();      // Result: Woof!
    }
}
```

Класата `Dog` наследува од `Animal` и додава метод `bark()`.

### 8.2. `is-a` наспроти `has-a`

**`is-a`** ја опишува релацијата наследување.

На пример, кучето е животно:

```text
Dog is an Animal
```

**`has-a`** ја опишува релацијата во која една класа содржи објект од друга класа како атрибут. Ова најчесто се моделира
преку композиција.

На пример, автомобил има мотор:

```text
Car has an Engine
```

Пример за композиција:

```java
class Engine {
    public void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private final Engine engine = new Engine();

    public void start() {
        engine.start();
        System.out.println("Car started");
    }
}

public class Main {
    static void main(String[] args) {
        Car car = new Car();

        car.start();
        // Result:
        // Engine started
        // Car started
    }
}
```

Наследувањето треба да се користи кога постои соодветна релација `is-a`, а композицијата кога една класа содржи или
користи друга класа.

### 8.3. Класна хиерархија

Класите можат да бидат поврзани преку хиерархија на наследување.

- **Директна суперкласа:** класата од која непосредно се наследува.
- **Индиректна суперкласа:** суперкласа што се наоѓа повисоко во хиерархијата.

Во Java, сите класи директно или индиректно потекнуваат од `java.lang.Object`, освен самата класа `Object`.

Ако декларацијата на класата не наведува друга суперкласа, таа подразбира наследување од `Object`.

## 9. Генерици (Generics)

Генериците овозможуваат класи, интерфејси и методи да работат со параметризирани типови.

Тие овозможуваат повторна употреба на кодот со различни типови податоци, со посилна проверка на типовите при
компајлирање.

### 9.1. Зошто се користат генерици?

Главни придобивки:

- **Типска безбедност:** несоодветните типови можат да се откријат при компајлирање.
- **Помалку кастирање:** не е потребно рачно претворање на типот при секое читање.
- **Повторна употреба:** една класа може да работи со различни типови податоци.
- **Почитлив код:** типот на елементите е експлицитно наведен.

### 9.2. Пример без генерици

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static void main(String[] args) {
        List list = new ArrayList();

        list.add("hello");

        String value = (String) list.get(0);

        System.out.println(value); // Result: hello
    }
}
```

Бидејќи колекцијата не го специфицира типот на елементите, потребно е кастирање.

### 9.3. Пример со генерици

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static void main(String[] args) {
        List<String> list = new ArrayList<>();

        list.add("hello");

        String value = list.get(0);

        System.out.println(value); // Result: hello
    }
}
```

`List<String>` означува листа што содржи `String` елементи. Не е потребно експлицитно кастирање при читање.

Следниот пример намерно содржи грешка при компајлирање:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static void main(String[] args) {
        List<String> names = new ArrayList<>();

        names.add("Ana");
        // names.add(5); // Compile-time error: int cannot be added to List<String>
    }
}
```

Колекцијата прифаќа стрингови, а не цели броеви.

### 9.4. Имиња на параметрите за типови

Вообичаените имиња се единечни големи букви:

| Параметар | Вообичаено значење  |
|-----------|---------------------|
| `E`       | Element             |
| `K`       | Key                 |
| `N`       | Number              |
| `T`       | Type                |
| `V`       | Value               |
| `S`, `U`  | Дополнителни типови |

Ова се конвенции за именување, а не задолжителни имиња.

### 9.5. Генеричка класа `Box`

Пример без генерици:

```java
class Box {
    private Object object;

    public void set(Object object) {
        this.object = object;
    }

    public Object get() {
        return object;
    }
}
```

Оваа класа може да чува различни видови објекти, но не ја ограничува нивната содржина на конкретен тип.

Генеричка верзија:

```java
class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}
```

Параметарот `T` го претставува типот што ќе се наведе при користење на класата.

Пример:

```java
public class Main {
    static void main(String[] args) {
        Box<Integer> integerBox = new Box<>();

        integerBox.set(10);

        Integer value = integerBox.get();

        System.out.println(value); // Result: 10
    }
}
```

Овој објект е наменет за чување вредности од типот `Integer`.

### 9.6. Повеќе параметри за типови

Генеричката класа или интерфејс може да има повеќе параметри.

```java
interface Pair<K, V> {
    K getKey();

    V getValue();
}

record OrderedPair<K, V>(K key, V value) implements Pair<K, V> {
    @Override
    public K getKey() {
        return key;
    }

    @Override
    public V getValue() {
        return value;
    }
}
```

Примери за инстанцирање:

```java
public class Main {
    static void main(String[] args) {
        OrderedPair<String, Integer> p1 =
                new OrderedPair<>("Even", 8);

        OrderedPair<String, String> p2 =
                new OrderedPair<>("hello", "world");

        System.out.println(p1.getKey() + ": " + p1.getValue()); // Result: Even: 8
        System.out.println(p2.getKey() + ": " + p2.getValue()); // Result: hello: world
    }
}
```

Кај `p1`, клучот е `String`, а вредноста е `Integer`. Кај `p2`, и клучот и вредноста се `String`.

### 9.7. Генерици и наследување

Ако `Integer` е подтип на `Number`, тоа не значи дека `Box<Integer>` е подтип на `Box<Number>`.

Следниот пример не е дозволен:

```java
class Box<T> {
    private T value;

    public void set(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }
}

public class Main {
    static void main(String[] args) {
        // Compile-time error:
        // Box<Number> box = new Box<Integer>();
    }
}
```

Генеричките типови во Java не се коваријантни на овој начин.

Сепак, `List<Number>` може да содржи различни подтипови на `Number`:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static void main(String[] args) {
        List<Number> numbers = new ArrayList<>();

        numbers.add(Integer.valueOf(5));
        numbers.add(Long.valueOf(1000L));
        numbers.add(Double.valueOf(3.14));

        // numbers.add("hello"); // Compile-time error: String is not a subtype of Number

        System.out.println(numbers); // Result: [5, 1000, 3.14]
    }
}
```

`Integer`, `Long` и `Double` се подтипови на `Number`, додека `String` не е.

## 10. Клучни поими за повторување

| Поим               | Значење                                                         |
|--------------------|-----------------------------------------------------------------|
| JDK                | Алатки потребни за развој на Java апликации                     |
| Класа              | Дефиниција на структурата и однесувањето на објектите           |
| Објект             | Инстанца на класа                                               |
| `main()`           | Стандардна влезна точка на Java апликација                      |
| Примитивен тип     | Тип што претставува примитивна вредност                         |
| Референтен тип     | Тип чии променливи можат да упатуваат на објекти                |
| `null`             | Вредност што означува дека референцата не упатува на објект     |
| Garbage Collection | Автоматско управување со меморијата на недостапните објекти     |
| Пакет              | Организациска целина за сродни класи и интерфејси               |
| Наследување        | Механизам за проширување на постоечка класа                     |
| Композиција        | Поврзување класи преку објекти што ги содржат или користат      |
| Генерици           | Параметризирање типови за повторна употреба и типска безбедност |
| `for`              | Циклус со иницијализација, услов и промена                      |
| `for-each`         | Циклус за поминување низ елементите на низа или колекција       |
| `while`            | Циклус што го проверува условот пред секоја итерација           |
| `do-while`         | Циклус што го проверува условот по извршувањето на телото       |

# 11. Објекти, референци и опсег на променливи

## 11.1 Креирање објекти

Класата претставува шаблон за креирање објекти. Објектот е конкретна инстанца на класата.

За креирање објект најчесто се користи операторот `new`.

```java
class Person {
    String name;
    int age;
}

public class Main {
    static void main(String[] args) {
        Person person = new Person();

        person.name = "Ana";
        person.age = 25;

        System.out.println(person.name);
        System.out.println(person.age);
    }
}
```

Во примерот:

- `Person` е класата.
- `person` е референтна променлива.
- `new Person()` креира нов објект.
- `name` и `age` се полиња на објектот.

Референтната променлива содржи референца преку која се пристапува до објектот.

## 11.2 Референци кон објекти

Две референтни променливи можат да се однесуваат на истиот објект.

```java
class Person {
    String name;
}

public class Main {
    static void main(String[] args) {
        Person first = new Person();
        first.name = "Ana";

        Person second = first;
        second.name = "Marko";

        System.out.println(first.name);  // Marko
        System.out.println(second.name); // Marko
    }
}
```

Изразот `second = first` не креира нов објект. Тој ја копира референцата, па двете променливи се однесуваат на истиот
објект.

Ако сакаме два независни објекта, треба да креираме два објекта.

```
Person first = new Person();
Person second = new Person();

first.name = "Ana";
second.name = "Marko";
```

Ова е фрагмент од код што претпоставува дека класата `Person` е дефинирана.

## 11.3 Примитивни и референтни типови

Java има осум примитивни типови: `byte`, `short`, `int`, `long`, `float`, `double`, `char` и `boolean`.

Референтни типови се типови како класи, низи и интерфејси.

Кај примитивните типови, доделувањето копира вредност.

```
int first = 10;
int second = first;

second = 20;

System.out.println(first);  // 10
System.out.println(second); // 20
```

Кај референтните типови, доделувањето копира референца.

Важно е да се разбере дека Java секогаш ги предава аргументите на методите **по вредност**. Кога аргументот е референтен
тип, се копира вредноста на референцата. Затоа методот може да го измени објектот преку таа референца, но доделувањето
друга референца на параметарот не ја менува променливата од која е повикан методот.

## 11.4 Опсег на променливи (Scope)

Опсегот определува каде во програмата може да се користи променливата.

**Локални променливи** се декларираат во метод или блок.

```java
public class Main {
    static void main(String[] args) {
        int number = 10;

        if (number > 0) {
            int result = number * 2;
            System.out.println(result);
        }

        // result не може да се користи надвор од блокот if.
    }
}
```

**Полињата на инстанца** припаѓаат на конкретен објект.

```java
class Person {
    String name;
    int age;
}
```

Секој објект од типот `Person` има сопствени вредности за `name` и `age`.

**Статичките полиња** припаѓаат на класата, а не на одделен објект.

```java
class Counter {
    static int count = 0;
}
```

Полето `count` е заедничко за сите инстанци на `Counter`.

Локалните променливи мора да добијат вредност пред да се користат. Полињата добиваат стандардни вредности ако не се
иницијализирани експлицитно.

# 12. Примитивни типови и wrapper класи

## 12.1 Примитивни типови

Java има осум примитивни типови.

| Тип       |                           Големина | Пример                  |
|-----------|-----------------------------------:|-------------------------|
| `byte`    |                             8 бита | `byte value = 10;`      |
| `short`   |                            16 бита | `short value = 1000;`   |
| `int`     |                            32 бита | `int value = 100000;`   |
| `long`    |                            64 бита | `long value = 100000L;` |
| `float`   |                            32 бита | `float value = 3.14f;`  |
| `double`  |                            64 бита | `double value = 3.14;`  |
| `char`    |                            16 бита | `char value = 'A';`     |
| `boolean` | Не е специфицирана фиксна големина | `boolean value = true;` |

`byte`, `short`, `int` и `long` се целобројни типови.

`float` и `double` се типови со подвижна запирка.

`char` претставува една UTF-16 кодна единица. Некои Unicode знаци бараат две кодни единици, па не секој знак може да се
претстави со еден `char`.

`boolean` може да има една од две вредности: `true` или `false`.

## 12.2 Wrapper класи

За секој примитивен тип постои соодветна wrapper класа.

| Примитивен тип | Wrapper класа |
|----------------|---------------|
| `byte`         | `Byte`        |
| `short`        | `Short`       |
| `int`          | `Integer`     |
| `long`         | `Long`        |
| `float`        | `Float`       |
| `double`       | `Double`      |
| `char`         | `Character`   |
| `boolean`      | `Boolean`     |

Wrapper класите ги претставуваат примитивните вредности како објекти и обезбедуваат корисни методи и константи.

```java
public class Main {
    static void main(String[] args) {
        int number = 42;
        Integer objectNumber = Integer.valueOf(number);

        System.out.println(objectNumber);
        System.out.println(Integer.MAX_VALUE);
    }
}
```

Wrapper класите се корисни кога работиме со генерички типови и колекции, бидејќи генеричките типови не прифаќаат
примитивни типови директно.

```java
import java.util.ArrayList;

public class Main {
    static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        System.out.println(numbers);
    }
}
```

Не можеме да напишеме `ArrayList<int>`. Мора да користиме `ArrayList<Integer>`.

## 12.3 Autoboxing и unboxing

**Autoboxing** е автоматска конверзија од примитивен тип во соодветната wrapper класа.

**Unboxing** е автоматска конверзија од wrapper објект во примитивен тип.

```java
public class Main {
    static void main(String[] args) {
        Integer objectNumber = 10; // Autoboxing
        int number = objectNumber; // Unboxing

        System.out.println(number);
    }
}
```

Wrapper објект може да има вредност `null`. Обидот за негово претворање во примитивен тип предизвикува
`NullPointerException`.

```java
Integer number = null;

// Следната инструкција предизвикува NullPointerException:
// int value = number;
```

Ова е фрагмент од код.

## 12.4 Споредување wrapper објекти

Кај примитивните типови, операторот `==` споредува вредности.

Кај референтните типови, `==` проверува дали двете референци се однесуваат на истиот објект.

```java
public class Main {
    static void main(String[] args) {
        Integer first = 1000;
        Integer second = 1000;

        System.out.println(first == second);
        System.out.println(first.equals(second));
    }
}
```

Првиот резултат не треба да се користи за проверка на еднаквост на вредностите. Вториот резултат е `true`, бидејќи
`equals()` ги споредува вредностите на `Integer`.

За споредување на вредностите на wrapper објекти, користете `equals()`. Ако некој објект може да биде `null`, прво
проверете го тоа или користете соодветен безбеден начин за споредување.

# 13. Полиња, методи и конструктори

## 13.1 Полиња и методи

Класата може да содржи полиња и методи.

**Полињата** ја опишуваат состојбата на објектот.

**Методите** го дефинираат неговото однесување.

```java
class Car {
    String brand;
    int speed;

    void accelerate() {
        speed += 10;
    }

    void displaySpeed() {
        System.out.println(speed);
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        Car car = new Car();

        car.brand = "Toyota";
        car.speed = 0;

        car.accelerate();
        car.displaySpeed(); // 10
    }
}
```

Методот `accelerate()` ја менува состојбата на објектот со зголемување на вредноста на `speed`.

## 13.2 Конструктори

Конструкторот е посебен член на класата што се повикува при создавање објект.

Конструкторот:

- го има истото име како класата;
- нема тип на повратна вредност, дури ни `void`;
- може да прима параметри;
- најчесто се користи за иницијализација на објектот.

```java
class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        Person person = new Person("Ana", 25);

        System.out.println(person.name);
        System.out.println(person.age);
    }
}
```

Конструкторот обезбедува објектот да добие почетни вредности при создавањето.

## 13.3 Клучниот збор `this`

`this` е референца кон тековниот објект.

Се користи, меѓу другото, кога параметарот има исто име како полето.

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}
```

Во `this.name`, `name` е полето на објектот. Во `name` од десната страна, `name` е параметарот на конструкторот.

`this` може да се користи и за повикување друг конструктор од истата класа.

```java
class Person {
    String name;
    int age;

    Person() {
        this("Unknown", 0);
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

Повикот `this(...)` мора да биде првата инструкција во конструкторот.

## 13.4 Стандарден конструктор

Ако програмерот не декларира ниту еден конструктор, компајлерот обезбедува конструктор без параметри.

```java
class Person {
    String name;
}
```

Ова овозможува:

```java
Person person = new Person();
```

Ако декларираме сопствен конструктор, Java повеќе не додава автоматски конструктор без параметри.

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}
```

Во овој случај, `new Person()` нема да се компајлира, бидејќи не постои конструктор без параметри.

Ако ни е потребен, мора експлицитно да го декларираме.

## 13.5 Преоптоварување на конструктори

Една класа може да има повеќе конструктори со различни листи на параметри. Ова се нарекува **constructor overloading**.

```java
class Rectangle {
    int width;
    int height;

    Rectangle() {
        this(1, 1);
    }

    Rectangle(int size) {
        this(size, size);
    }

    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
}
```

Употреба:

```java
Rectangle first = new Rectangle();
Rectangle second = new Rectangle(5);
Rectangle third = new Rectangle(4, 6);
```

Java избира конструктор според бројот и типовите на аргументите.

# 14. Низи (Arrays)

## 14.1 Декларирање и создавање низа

Низата е структура што содржи фиксен број елементи од ист тип.

```java
int[] numbers = new int[5];
```

Ова создава низа со пет елементи од тип `int`.

Индексите започнуваат од `0`, па индексите се `0`, `1`, `2`, `3` и `4`.

```
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;

System.out.println(numbers[0]); // 10
```

Пристапот до индекс надвор од дозволениот опсег предизвикува `ArrayIndexOutOfBoundsException`.

## 14.2 Иницијализација на низа

Низа може да се иницијализира директно со вредности.

```java
int[] numbers = {10, 20, 30, 40};
```

Бројот на елементи се добива преку полето `length`.

```
System.out.println(numbers.length); // 4
```

`length` кај низите е поле, а не метод. Затоа се пишува `numbers.length`, а не `numbers.length()`.

## 14.3 Поминување низ низа

Класичен `for` циклус овозможува пристап до индексот и елементот.

```
int[] numbers = {10, 20, 30};

for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
```

Ако ни е потребна само вредноста на секој елемент, можеме да користиме `for-each`.

```
for (int number : numbers) {
    System.out.println(number);
}
```

Овие примери се фрагменти од код и претпоставуваат дека променливата `numbers` е декларирана.

## 14.4 Низи од референци

Низата може да содржи референци кон објекти.

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}
```

Создавање и користење на низата:

```
Person[] people = new Person[2];

people[0] = new Person("Ana");
people[1] = new Person("Marko");
```

Изразот `new Person[2]` создава низа со две референтни позиции. Не создава автоматски два објекта од типот `Person`.

Пред да им доделиме објекти, елементите имаат вредност `null`.

Обидот да пристапиме до поле или да повикаме метод преку `null` референца предизвикува `NullPointerException`.

## 14.5 Дводимензионални низи

Дводимензионална низа често се користи за претставување табела или матрица.

```java
int[][] matrix = {
        {1, 2, 3},
        {4, 5, 6}
};
```

Пристап до елемент:

```
System.out.println(matrix[0][0]); // 1
System.out.println(matrix[1][2]); // 6
```

Првиот индекс одредува редица, а вториот колона.

Поминување низ матрицата:

```
for (int row = 0; row < matrix.length; row++) {
    for (int column = 0; column < matrix[row].length; column++) {
        System.out.print(matrix[row][column] + " ");
    }

    System.out.println();
}
```

Java поддржува и низи чии редици имаат различен број елементи.

```
int[][] values = new int[3][];

values[0] = new int[2];
values[1] = new int[4];
values[2] = new int[1];
```

Ова се нарекува jagged array.

# 15. Пакети и пристапни модификатори

## 15.1 Пакети (Packages)

Пакетите служат за организирање на класите и избегнување конфликти во имињата.

На почетокот на Java-датотеката можеме да наведеме пакет.

```java
package com.example.people;

public class Person {
}
```

Вообичаено, структурата на директориумите ја следи структурата на името на пакетот.

```text
src/
└── com/
    └── example/
        └── people/
            └── Person.java
```

Класата од друг пакет може да се користи со целосно квалификувано име или со `import`.

```java
import com.example.people.Person;
```

Пакетите помагаат кодот да биде организиран во логички целини.

## 15.2 Пристапни модификатори

Java обезбедува четири главни нивоа на пристап.

| Модификатор                       | Пристап                                                                         |
|-----------------------------------|---------------------------------------------------------------------------------|
| `public`                          | Достапен од места каде што типот или членот е видлив                            |
| `protected`                       | Во истиот пакет и, според правилата за наследување, од подкласи во други пакети |
| Без модификатор (package-private) | Во истиот пакет                                                                 |
| `private`                         | Во рамките на истата класа                                                      |

Пример:

```java
class Account {
    public String owner;
    protected String category;
    int number;
    private double balance;
}
```

Во овој пример:

- `owner` е јавен член.
- `category` има `protected` пристап.
- `number` има package-private пристап.
- `balance` е приватен член.

Пристапните модификатори контролираат кој дел од програмата може да ги користи членовите на класата.

# 16. Енкапсулација (Encapsulation)

Енкапсулацијата е принцип на објектно-ориентираното програмирање според кој пристапот до внатрешната состојба на
објектот се контролира преку дефиниран интерфејс.

Чест пристап е полињата да се декларираат како `private`, а пристапот до нив да се обезбеди преку јавни методи.

```java
class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException(
                    "Initial balance cannot be negative."
            );
        }

        this.balance = initialBalance;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be positive."
            );
        }

        balance += amount;
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        BankAccount account = new BankAccount(100);

        account.deposit(50);

        System.out.println(account.getBalance()); // 150
    }
}
```

Не можеме директно да го менуваме полето `balance` однадвор, бидејќи е `private`.

Наместо тоа, повикуваме методи што ги проверуваат условите пред да ја изменат состојбата.

Енкапсулацијата не значи дека секое поле мора да има getter и setter. Методите треба да го претставуваат потребниот
интерфејс на класата, а не автоматски да ги изложуваат сите полиња.

# 17. Наследување и клучниот збор `super`

## 17.1 Основи на наследувањето

Наследувањето овозможува една класа да наследи достапни членови од друга класа.

Класата од која се наследува се нарекува суперкласа или базна класа.

Класата што наследува се нарекува подкласа или изведена класа.

```java
class Animal {
    void eat() {
        System.out.println("Animal is eating.");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Dog is barking.");
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        Dog dog = new Dog();

        dog.eat();
        dog.bark();
    }
}
```

`Dog` може да го користи наследениот метод `eat()` и сопствениот метод `bark()`.

Java дозволува една класа директно да наследува само една класа. Сепак, класа може да имплементира повеќе интерфејси.

## 17.2 Клучниот збор `super`

`super` се користи за пристап до членови на суперкласата и за повикување конструктор од суперкласата.

```java
class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void display() {
        System.out.println(name);
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);
    }
}
```

`super(name)` го повикува конструкторот на `Animal`.

Ако не е наведено поинаку, Java се обидува да повика конструктор `super()` без параметри. Тоа е можно само ако
суперкласата има достапен конструктор без параметри.

Во традиционалната Java синтакса, повикот `super(...)` мора да биде првата инструкција во конструкторот. Поновите верзии
на Java имаат ограничени можности за инструкции пред повикот на конструкторот на суперкласата, но за основните примери
треба да се користи вообичаениот редослед.

## 17.3 Надминување на методи (Overriding)

Подкласата може да обезбеди сопствена имплементација на наследен метод. Ова се нарекува **method overriding**.

```java
class Animal {
    void makeSound() {
        System.out.println("Unknown sound.");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}
```

Анотацијата `@Override` не е задолжителна, но се препорачува бидејќи компајлерот проверува дали методот навистина
надминува наследен метод.

# 18. Upcasting и полиморфизам

## 18.1 Upcasting

Upcasting е доделување референца од подкласа на променлива од типот на нејзината суперкласа.

```java
Dog dog = new Dog("Rex");
Animal animal = dog;
```

Овој фрагмент претпоставува дека класите `Dog` и `Animal` имаат соодветни дефиниции.

`animal` и `dog` се однесуваат на истиот објект.

Преку референцата `animal` можеме да пристапиме до членовите достапни преку типот `Animal`.

Ако `Dog` има дополнителен метод `bark()`, не можеме директно да го повикаме преку референцата `animal`, бидејќи типот
на референцата е `Animal`.

Upcasting е автоматски кога постои валидна врска на наследување.

## 18.2 Полиморфизам

Полиморфизам значи дека објекти од различни подкласи можат да се обработуваат преку заеднички суперкласен тип, додека
секоја подкласа може да обезбеди сопствено однесување.

```java
class Animal {
    void makeSound() {
        System.out.println("Unknown sound.");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow!");
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        Animal first = new Dog();
        Animal second = new Cat();

        first.makeSound();  // Woof!
        second.makeSound(); // Meow!
    }
}
```

Иако двете референци се од тип `Animal`, Java извршува имплементација според вистинскиот тип на објектот.

Ова се нарекува **динамичко повикување на методи (dynamic method dispatch)**.

## 18.3 Зошто полиморфизмот е корисен?

Полиморфизмот овозможува кодот да работи со апстракции наместо да зависи од конкретни класи.

```java
static void playSound(Animal animal) {
    animal.makeSound();
}
```

Овој фрагмент може да биде дел од класата `Main` или друга соодветна класа. Методот може да прима објекти од тип `Dog`,
`Cat` или друга соодветна подкласа на `Animal`.

Не мора да креираме посебен метод за секој тип животно.

# 19. Overloading наспроти Overriding

Овие два концепта имаат различна цел.

**Overloading (преоптоварување)** значи дефинирање повеќе методи со исто име, но со различни листи на параметри.

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

Компајлерот избира кој метод ќе се повика според типовите и бројот на аргументите. Ова се разрешува при компајлирање.

**Overriding (надминување)** значи подкласата да обезбеди нова имплементација на наследен метод со соодветна сигнатура.

```java
class Animal {
    void makeSound() {
        System.out.println("Unknown sound.");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}
```

При overriding, имплементацијата на инстанцискиот метод се избира според вистинскиот тип на објектот при извршување.

| Карактеристика          | Overloading                                  | Overriding                                                             |
|-------------------------|----------------------------------------------|------------------------------------------------------------------------|
| Име на методот          | Исто                                         | Исто                                                                   |
| Параметри               | Мора да се разликуваат                       | Мора да одговараат на наследениот метод според правилата за overriding |
| Наследување             | Не е задолжително                            | Потребно е наследување или друга соодветна хиерархија                  |
| Избор на имплементација | При компајлирање                             | При извршување за инстанциски методи                                   |
| Цел                     | Повеќе начини за повикување слична операција | Специјализирано однесување во подкласа                                 |

Само различен тип на повратна вредност не е доволен за overloading.

На пример, не можеме да дефинираме два метода со исто име и исти параметри, но различни повратни типови.

# 20. Апстрактни класи и методи

## 20.1 Апстрактна класа

Апстрактната класа се декларира со клучниот збор `abstract`.

Не може директно да се инстанцира, но може да служи како основа за други класи.

```java
abstract class Shape {
    abstract double calculateArea();

    void display() {
        System.out.println("This is a shape.");
    }
}
```

Класата `Shape` содржи апстрактен метод `calculateArea()` и конкретен метод `display()`.

Апстрактниот метод нема тело. Конкретните подкласи мора да го имплементираат, освен ако и самите се декларирани како
апстрактни.

## 20.2 Имплементација во подкласи

```java
class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle extends Shape {
    private final double width;
    private final double height;

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    double calculateArea() {
        return width * height;
    }
}
```

Употреба:

```java
public class Main {
    static void main(String[] args) {
        Shape circle = new Circle(5);
        Shape rectangle = new Rectangle(4, 6);

        System.out.println(circle.calculateArea());
        System.out.println(rectangle.calculateArea());
    }
}
```

И двата објекта се обработуваат преку типот `Shape`, но секој ја користи својата имплементација на `calculateArea()`.

## 20.3 Кога се користи апстрактна класа?

Апстрактна класа е корисна кога повеќе сродни класи треба да споделуваат заедничка состојба или имплементација, но
основниот концепт не треба да се инстанцира директно.

На пример, `Shape` претставува општ концепт. Конкретни форми како `Circle` и `Rectangle` ја дефинираат пресметката на
површината.

# 21. Редослед на иницијализација и конструктори

Кога се создава објект од класа што наследува друга класа, Java ги иницијализира деловите од објектот во определен
редослед.

За основниот случај, редоследот е:

1. При иницијализација на класите, се извршуваат статичките иницијализации на суперкласите пред статичките
   иницијализации на подкласите.
2. Меморијата за објектот се алоцира и полињата добиваат стандардни вредности.
3. Се извршуваат иницијализацијата на полињата и блоковите за инстанца на суперкласата, а потоа конструкторот на
   суперкласата.
4. Се извршуваат иницијализацијата на полињата и блоковите за инстанца на подкласата, а потоа остатокот од конструкторот
   на подкласата.

Пример:

```java
class Parent {
    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    Child() {
        System.out.println("Child constructor");
    }
}

public class Main {
    static void main(String[] args) {
        new Child();
    }
}
```

Излез:

```text
Parent constructor
Child constructor
```

Конструкторот на суперкласата се извршува пред остатокот од конструкторот на подкласата.

Ова е важно затоа што подкласата често зависи од состојбата иницијализирана од суперкласата.

## 21.1 Стандардни вредности на полињата

Полињата добиваат стандардни вредности пред да се изврши нивната експлицитна иницијализација.

| Тип                          | Стандардна вредност |
|------------------------------|---------------------|
| Целобројни примитивни типови | `0`                 |
| `float` и `double`           | `0.0`               |
| `char`                       | `'\u0000'`          |
| `boolean`                    | `false`             |
| Референтни типови            | `null`              |

Овие стандардни вредности важат за полињата на класите и објектите, а не за локалните променливи. Локалните променливи
мора да бидат иницијализирани пред да се прочитаат.

# 22. Клучни поими за повторување

| Поим             | Објаснување                                                                |
|------------------|----------------------------------------------------------------------------|
| Класа            | Шаблон што дефинира полиња и методи                                        |
| Објект           | Инстанца на класа                                                          |
| Референца        | Вредност преку која се пристапува до објект                                |
| Примитивен тип   | Тип што претставува примитивна вредност                                    |
| Wrapper класа    | Класа што ја претставува вредноста на примитивен тип како објект           |
| Scope            | Опсег во кој може да се користи променлива                                 |
| Конструктор      | Посебен член што се повикува при создавање објект                          |
| `this`           | Референца кон тековниот објект                                             |
| `super`          | Механизам за повикување конструктор или пристап до членови на суперкласата |
| Array            | Структура со фиксен број елементи од ист тип                               |
| Package          | Механизам за организирање на типови                                        |
| Access modifier  | Модификатор што го контролира пристапот до членови и типови                |
| Encapsulation    | Контрола на пристапот до внатрешната состојба на објектот                  |
| Inheritance      | Механизам за наследување од друга класа                                    |
| Upcasting        | Користење референца од подкласа преку суперкласен тип                      |
| Polymorphism     | Различно однесување преку заеднички тип                                    |
| Overloading      | Повеќе методи со исто име и различни параметри                             |
| Overriding       | Нова имплементација на наследен метод                                      |
| Abstract class   | Класа што не може директно да се инстанцира                                |
| Abstract method  | Метод без имплементација што треба да се дефинира во конкретна подкласа    |
| Dynamic dispatch | Избор на инстанциски метод според вистинскиот тип на објектот              |

## Важни разлики

- Класата е шаблон; објектот е конкретна инстанца.
- Примитивната променлива содржи примитивна вредност; референтната променлива содржи референца.
- Доделување референца не креира нов објект.
- Java ги предава аргументите по вредност, вклучувајќи ги и аргументите што содржат референци.
- `this` се однесува на тековниот објект; `super` се користи за пристап до суперкласата.
- Overloading се однесува на различни листи на параметри; overriding се однесува на специјализирање наследен метод.
- Енкапсулацијата го контролира пристапот до внатрешната состојба; наследувањето воспоставува хиерархија меѓу класите.
- Upcasting овозможува работа преку општ тип; полиморфизмот овозможува соодветното однесување да се избере според
  конкретниот објект.
- Апстрактната класа дефинира заедничка основа, но не може директно да се инстанцира.
- Низата има фиксен број елементи; секој индекс мора да биде во дозволениот опсег.
- Локалните променливи мора да се иницијализираат пред употреба; полињата добиваат стандардни вредности.
