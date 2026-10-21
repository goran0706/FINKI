package _08_generics;

import java.util.HashMap;
import java.util.Map;

/*
 * GENERIC REPOSITORY
 *
 * A repository is an abstraction for accessing and managing objects of a
 * particular type.
 *
 * A generic repository can define common operations once and reuse them
 * for different entity types.
 *
 * This example demonstrates the generic design only. The data is stored
 * in memory rather than a database.
 *
 * In a production application, a repository implementation might use
 * a database, while application and domain layers depend on an
 * appropriate repository abstraction.
 */
public class _19_GenericRepository {

    static void main(String[] args) {

        /*
         * Employee IDs are Strings, so the repository uses:
         * T = Employee
         * ID = String
         */
        Repository<Employee, String> employeeRepository =
                new InMemoryRepository<>();

        Employee employee = new Employee("EMP-001", "Alex");

        employeeRepository.save(employee.id(), employee);

        Employee foundEmployee =
                employeeRepository.findById("EMP-001");

        System.out.println(foundEmployee);

        System.out.println(
                "Employee exists: "
                        + employeeRepository.existsById("EMP-001")
        );

        employeeRepository.deleteById("EMP-001");

        System.out.println(
                "Employee exists after deletion: "
                        + employeeRepository.existsById("EMP-001")
        );

        /*
         * Bank account IDs are Long values, so this repository uses:
         * T = BankAccount
         * ID = Long
         *
         * The same repository implementation works without duplicating
         * its CRUD operations.
         */
        Repository<BankAccount, Long> accountRepository =
                new InMemoryRepository<>();

        BankAccount account = new BankAccount(1001L, 2500.00);

        accountRepository.save(account.id(), account);

        BankAccount foundAccount =
                accountRepository.findById(1001L);

        System.out.println(foundAccount);

        /*
         * This design provides compile-time type safety.
         *
         * The employee repository cannot store BankAccount objects,
         * and the account repository cannot use String IDs.
         *
         * A real repository would also need decisions about transactions,
         * persistence, error handling, concurrency, and entity identity.
         */
    }

    /*
     * Generic repository interface.
     *
     * T represents the entity type.
     * ID represents the type used to identify an entity.
     *
     * Different entities can use different ID types.
     */
    interface Repository<T, ID> {

        void save(ID id, T entity);

        T findById(ID id);

        boolean deleteById(ID id);

        boolean existsById(ID id);
    }

    /*
     * Generic in-memory implementation.
     *
     * HashMap stores entities using their IDs as keys.
     * The type parameters ensure that keys and values have consistent types.
     */
    static class InMemoryRepository<T, ID> implements Repository<T, ID> {

        private final Map<ID, T> entities = new HashMap<>();

        @Override
        public void save(ID id, T entity) {
            entities.put(id, entity);
        }

        @Override
        public T findById(ID id) {
            return entities.get(id);
        }

        @Override
        public boolean deleteById(ID id) {
            return entities.remove(id) != null;
        }

        @Override
        public boolean existsById(ID id) {
            return entities.containsKey(id);
        }
    }

    record Employee(String id, String name) {

        @Override
        public String toString() {
            return "Employee{id='" + id + "', name='" + name + "'}";
        }
    }

    record BankAccount(Long id, double balance) {

        @Override
        public String toString() {
            return "BankAccount{id=" + id + ", balance=" + balance + "}";
        }
    }
}