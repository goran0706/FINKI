package _01_fundamentals;

import java.text.DecimalFormat;

public class _21_DecimalFormat {

    static void main(String[] args) {

        /*
         * DecimalFormat formats numeric values as strings using patterns.
         *
         * Common pattern symbols:
         * 0 - Digit; displays zero if no digit is available.
         * # - Digit; omitted if no digit is available.
         * . - Decimal separator.
         * , - Grouping separator.
         * % - Multiplies the value by 100 and displays a percent sign.
         *
         * Important:
         * - format() returns a String, not a numeric value.
         * - Rounding depends on the configured rounding mode.
         * - DecimalFormat uses locale-specific symbols by default.
         */

        // 1. Format a decimal number to two decimal places.
        double pi = 3.142;

        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        String formattedPi = decimalFormat.format(pi);

        System.out.println("Formatted PI: " + formattedPi);


        // 2. Format a price with a currency symbol.
        double price = 10_000.1234;

        DecimalFormat priceFormat = new DecimalFormat("$#,##0.00");
        String formattedPrice = priceFormat.format(price);

        System.out.println("Formatted price: " + formattedPrice);


        // 3. Force two decimal places, including trailing zeros.
        double amount = 25.5;

        DecimalFormat twoDecimalPlaces = new DecimalFormat("0.00");

        System.out.println(
                "Amount: " + twoDecimalPlaces.format(amount)
        );


        // 4. Add grouping separators for large numbers.
        double population = 1_234_567.89;

        DecimalFormat groupedNumber = new DecimalFormat("#,##0.00");

        System.out.println(
                "Population: " + groupedNumber.format(population)
        );


        // 5. Format a percentage.
        double completion = 0.856;

        DecimalFormat percentageFormat = new DecimalFormat("0.0%");

        System.out.println(
                "Completion: " + percentageFormat.format(completion)
        );


        // 6. Format a number with optional decimal places.
        double measurement = 12.5;

        DecimalFormat optionalDecimals = new DecimalFormat("#.##");

        System.out.println(
                "Measurement: " + optionalDecimals.format(measurement)
        );
    }
}