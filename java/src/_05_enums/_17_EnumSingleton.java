package _05_enums;

/*
 * ENUM SINGLETON
 *
 * An enum with a single constant can implement the Singleton pattern.
 *
 * Java guarantees that each enum constant has exactly one instance
 * within the JVM. Enum singletons also receive built-in serialization
 * and reflection protections that ordinary class-based singletons
 * must handle separately.
 *
 * This example demonstrates the pattern, not a recommendation to use
 * an enum for every singleton.
 */
public class _17_EnumSingleton {

    static void main(String[] args) {

        // Access the single instance through its enum constant.
        ApplicationConfig config1 = ApplicationConfig.INSTANCE;

        config1.setApplicationName("Account Management");

        // Both variables refer to the same instance.
        ApplicationConfig config2 = ApplicationConfig.INSTANCE;

        System.out.println(config1.getApplicationName());
        System.out.println(config2.getApplicationName());

        System.out.println(config1 == config2); // true
    }

    enum ApplicationConfig {

        INSTANCE;

        private String applicationName = "Banking Application";

        public String getApplicationName() {
            return applicationName;
        }

        public void setApplicationName(String applicationName) {
            this.applicationName = applicationName;
        }
    }
}