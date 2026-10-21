package _19_solid_principles;

/*
 * INTERFACE SEGREGATION PRINCIPLE (ISP)
 *
 * Definition:
 * Clients should not be forced to depend on methods they do not use.
 *
 * In simpler terms:
 * Prefer several small, focused interfaces over one large interface that
 * combines unrelated capabilities.
 *
 * Here, a client means a class that depends on or implements an interface.
 *
 * ------------------------------------------------------------
 * VIOLATION
 * ------------------------------------------------------------
 *
 * Imagine a machine interface that requires every machine to:
 *
 * - Print documents.
 * - Scan documents.
 * - Fax documents.
 *
 * A basic printer can print, but it cannot scan or fax.
 *
 * If BasicPrinter implements this interface, it must provide implementations
 * for methods that do not belong to its actual capabilities.
 *
 * Throwing UnsupportedOperationException from those methods avoids pretending
 * the operations work, but it does not correct the interface design.
 *
 * ------------------------------------------------------------
 * SOLUTION
 * ------------------------------------------------------------
 *
 * Split the large interface into smaller capability interfaces:
 *
 * - Printer: printing capability.
 * - Scanner: scanning capability.
 * - Fax: faxing capability.
 *
 * Each machine implements only the interfaces representing its capabilities.
 * A multifunction machine can implement all three.
 */

public class _05_InterfaceSegregationPrinciple {

    static void main(String[] args) {

        // VIOLATION EXAMPLE
        //
        // BasicPrinter is forced to implement scan() and fax(), even though
        // those operations are not supported by the device.
        OldBasicPrinter oldPrinter = new OldBasicPrinter();

        oldPrinter.print("Monthly report");

        // These calls compile but fail at runtime.
        // oldPrinter.scan();
        // oldPrinter.fax();

        // CORRECTED DESIGN
        //
        // A basic printer implements only Printer.
        Printer basicPrinter = new BasicPrinter();

        basicPrinter.print("Monthly report");

        // A multifunction machine implements each supported capability.
        MultiFunctionPrinter multiFunctionPrinter =
                new MultiFunctionPrinter();

        multiFunctionPrinter.print("Invoice");
        multiFunctionPrinter.scan();
        multiFunctionPrinter.fax();

        // Code that only needs printing depends on the smallest relevant
        // abstraction, regardless of the actual printer implementation.
        printDocument(basicPrinter, "Employee contract");
        printDocument(multiFunctionPrinter, "Annual report");
    }

    /*
     * This method depends only on the capability it needs.
     *
     * It does not need to know whether the supplied printer can scan or fax.
     */
    static void printDocument(Printer printer, String document) {
        printer.print(document);
    }

    /*
     * VIOLATION EXAMPLE
     *
     * Every implementation must provide all three operations, regardless
     * of whether the actual device supports them.
     */
    interface OldMachine {

        void print(String document);

        void scan();

        void fax();
    }

    /*
     * CORRECTED DESIGN
     *
     * Each interface represents one capability.
     * Classes implement only the capabilities they actually support.
     */
    interface Printer {

        void print(String document);
    }

    interface Scanner {

        void scan();
    }

    interface Fax {

        void fax();
    }

    static class OldBasicPrinter implements OldMachine {

        @Override
        public void print(String document) {
            System.out.println("Printing: " + document);
        }

        @Override
        public void scan() {
            throw new UnsupportedOperationException(
                    "This printer cannot scan"
            );
        }

        @Override
        public void fax() {
            throw new UnsupportedOperationException(
                    "This printer cannot fax"
            );
        }
    }

    /*
     * A basic printer supports printing only.
     */
    static class BasicPrinter implements Printer {

        @Override
        public void print(String document) {
            System.out.println("Basic printer: printing " + document);
        }
    }

    /*
     * A multifunction printer supports all three capabilities.
     */
    static class MultiFunctionPrinter
            implements Printer, Scanner, Fax {

        @Override
        public void print(String document) {
            System.out.println("Multifunction printer: printing " + document);
        }

        @Override
        public void scan() {
            System.out.println("Multifunction printer: scanning document");
        }

        @Override
        public void fax() {
            System.out.println("Multifunction printer: sending fax");
        }
    }
}

/*
 * IMPORTANT DISTINCTIONS
 *
 * 1. ISP is about the design of interfaces and the dependencies they impose.
 *
 * 2. A large interface is not automatically bad.
 *    If all its operations form one cohesive contract and all implementations
 *    genuinely support them, a larger interface may be appropriate.
 *
 * 3. Avoid forcing implementations to provide meaningless methods or methods
 *    that always throw UnsupportedOperationException merely because the
 *    interface requires them.
 *
 * 4. Small interfaces allow clients to depend only on the operations they need.
 *
 * 5. ISP complements SRP:
 *    SRP focuses on reasons a class should change.
 *    ISP focuses on keeping interface contracts relevant to their clients.
 *
 * 6. Do not create an interface for every individual method by default.
 *    Split interfaces when clients or implementations have genuinely different
 *    capability requirements.
 */