module.exports = getDate;
// module.exports.getDate = getDate;

function getDate() {
    let today = new Date();

    let options = {     // stackoverflow: how to format javascript dates.
        weekday: "long",
        day: "numeric",
        month: "long" 
    };

    let day = today.toLocaleDateString("en-US", options); // Returns a date as a string value appropriate to the host environment's current locale.

    return day;
}

/*M-2

module.exports.getDate = getDate;
var getDate = function() {      // getDate variable is bound to anonymous function.
    let today = new Date();

    let options = {     // stackoverflow: how to format javascript dates.
        weekday: "long",
        day: "numeric",
        month: "long" 
    };

    let day = today.toLocaleDateString("en-US", options); // Returns a date as a string value appropriate to the host environment's current locale.

    return day;
}

*/


/* M-3

exports.getDate = function() {      // getDate variable is bound to anonymous function.
    let today = new Date();

    let options = {     // stackoverflow: how to format javascript dates.
        weekday: "long",
        day: "numeric",
        month: "long" 
    };

    return today.toLocaleDateString("en-US", options); // Returns a date as a string value appropriate to the host environment's current locale.
}

*/


