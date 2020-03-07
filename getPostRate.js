module.exports = {
    getPostRate: function (parcelType, weight) {
        switch (parcelType) {
            case 'letterStamped':
                if (weight <= 1)
                    return 0.55;
                if (weight <= 2)
                    return 0.7;
                if (weight <= 3)
                    return 0.85;
                return 1.00;

            case 'letterMetered':
                if (weight <= 1)
                    return 0.5;
                if (weight <= 2)
                    return 0.65;
                if (weight <= 3)
                    return 0.8;
                return 0.95;

            case 'largeEnv':
                if (weight <= 1)
                    return 1.0;
                if (weight <= 2)
                    return 1.2;
                if (weight <= 3)
                    return 1.4;
                if (weight <= 4)
                    return 1.6;
                if (weight <= 5)
                    return 1.8;
                if (weight <= 6)
                    return 2.0;
                if (weight <= 7)
                    return 2.2;
                if (weight <= 8)
                    return 2.4;
                if (weight <= 9)
                    return 2.6;
                if (weight <= 10)
                    return 2.8;
                if (weight <= 11)
                    return 3.0;
                if (weight <= 12)
                    return 3.2;
                return 3.4;

            case 'firstClass':
                if (weight <= 1)
                    return 3.8;
                if (weight <= 2)
                    return 3.8;
                if (weight <= 3)
                    return 3.8;
                if (weight <= 4)
                    return 3.8;
                if (weight <= 5)
                    return 4.6;
                if (weight <= 6)
                    return 4.6;
                if (weight <= 7)
                    return 4.6;
                if (weight <= 8)
                    return 4.6;
                if (weight <= 9)
                    return 5.3;
                if (weight <= 10)
                    return 5.3;
                if (weight <= 11)
                    return 5.3;
                if (weight <= 12)
                    return 5.3;
                return 5.9;
        }
    },
    getParcelTypeDescriptionString: function (name) {
        switch (name) {
            case "letterStamped":

                return "Letters (Stamped)";
            case "letterMetered":
                return "Letters (Metered)";
            case "largeEnv":
                return "Large Envelopes (Flats)";
            case "firstClass":
                return "First-Class Package";

            default:
                break;
        }
    }
};
