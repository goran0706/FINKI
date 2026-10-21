package _08_generics;

/*
 * GENERIC INTERFACES
 *
 * An interface can declare a type parameter, just like a generic class.
 *
 * When a class implements a generic interface, it can:
 * 1. Specify a concrete type for the interface's type parameter.
 * 2. Remain generic and pass its own type parameter to the interface.
 *
 * This example demonstrates both approaches.
 */
public class _04_GenericInterfaces {

    static void main(String[] args) {

        Repository<String> stringRepository = new StringRepository();
        stringRepository.save("Account statement");
        System.out.println(stringRepository.find());

        Repository<Integer> integerRepository = new GenericRepository<>();
        integerRepository.save(1001);
        System.out.println(integerRepository.find());
    }

    interface Repository<T> {
        void save(T item);

        T find();
    }

    // Specifies String as the interface's type parameter.
    static class StringRepository implements Repository<String> {

        private String item;

        @Override
        public void save(String item) {
            this.item = item;
        }

        @Override
        public String find() {
            return item;
        }
    }

    // Remains generic and passes T to Repository<T>.
    static class GenericRepository<T> implements Repository<T> {

        private T item;

        @Override
        public void save(T item) {
            this.item = item;
        }

        @Override
        public T find() {
            return item;
        }
    }
}