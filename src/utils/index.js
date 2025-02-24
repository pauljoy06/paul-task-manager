const byString = function (object, string, value, forceUseValue=false) {
    // Return `undefined` if not a string
    try {
        string = string.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        string = string.replace(/^\./, '');           // strip a leading dot
    } catch (TypeError) {
        return undefined;
    }

    var nestedKeys = string.split('.');
    for (var i = 0, n = nestedKeys.length; i < n; ++i) {
        var key = nestedKeys[i].replace(/\%/, '.');  // To allow for keys with dots in them

        string = string.replace(/^\./, '');           // strip a leading dot

        // If the key represents an array index
        if (!isNaN(key)) {
            key = parseInt(key);
        }

        if (
            (object !== null && key in object) ||
            (Array.isArray(object) && key <= object.length  // To allow assignment of index `0` to empty array
            )
        ) {
            if (value !== undefined && i + 1 === nestedKeys.length) {
                object[key] = value;
            } else if (forceUseValue && i + 1 === nestedKeys.length) {
                object[key] = value;
            } else {
                object = object[key];
            }
        } else {
            return undefined;
        }
    }

    return object;
}

const getTime = function(originalTimeString) {
    let timeString;
    // Default hour and minute values
    let defaultHour = 10;
    let hour = defaultHour;
    let defaultMinute = 0;
    let minute = defaultMinute;
    let prefixUsed = '';    // 'AM' or 'PM' or ''

    // Trim out whitespace
    timeString = originalTimeString.trim();

    // Capitalize string
    timeString = timeString.toUpperCase();

    // Get rid of the am/pm prefixes and determine if a 12 hour offset is required
    let addOffset = false;
    if (timeString.includes('AM')) {
        prefixUsed = 'AM';
        let amPosition = timeString.indexOf('AM');
        timeString = timeString.substring(0, amPosition - 1);
    } else if (timeString.includes('PM')) {
        prefixUsed = 'PM';
        let pmPosition = timeString.indexOf('PM');
        timeString = timeString.substring(0, pmPosition - 1);
        addOffset = true;
    }

    // Get the hour and the minute from the string only if the string format is right
    if (timeString.includes(':')) {
        let hourStr = timeString.split(':')[0].trim();
        let minuteStr = timeString.split(':')[1].trim();

        if (/^\d+$/.test(hourStr) && /^\d+$/.test(minuteStr)) {
            hour = parseInt(hourStr);
            minute = parseInt(minuteStr);
        }
    } else {
        let hourStr = timeString.split(':')[0].trim();

        if (/^\d+$/.test(hourStr)) {
            hour = parseInt(hourStr);
        }
    }

    // Edge cases of 12 AM and 12 PM which translate to 00:00 and 12:00 respectively
    if (prefixUsed === 'AM' && hour === 12) {
        hour = 0;
    } else if (prefixUsed === 'PM' && hour === 12) {
        hour = 12;
    } else if (addOffset) {
        hour += 12;
    }

    if (hour > 24 || hour < 0 || minute > 60 || minute < 0) {
        hour = defaultHour;
        minute = defaultMinute;
    }

    // To prepend with `0` for single digit integers
    // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0
    let doubleDigitHourString = ('0' + hour).slice(-2);
    let doubleDigitMinuteString = ('0' + minute).slice(-2);;

    return `${doubleDigitHourString}:${doubleDigitMinuteString}`;
}

// Generates JSON object copy - doesn't copy functions
const copy = function(obj) {
    return JSON.parse(JSON.stringify( obj, (key, value) => typeof(value) === 'bigint'
        ? value.toString() : value)
    );
}

// This function converts a list into a map ie. an object with
// the property specified as the key of each object.
const getMap = function(
    list,
    property,
    asArray=false,
    modifyKey=key => key,
    valueProperty=null
) {
    /* If `asArray` is set to `true`, each property has an array */
    /* If `valueProperty` is set, only that property's value is considered, instead
     * of the whole object. */

    let map = {};
    let key;
    list.map((item) => {
        key = modifyKey(item[property]);


        if (asArray) {
            if (!map.hasOwnProperty(key)) {
                map[key] = [];
            }

            if (valueProperty !== null) {
                map[key].push(item[valueProperty]);
            } else {
                map[key].push(item);
            }
        } else {
            if (valueProperty !== null) {
                // console.log(map, key);
                map[key] = item[valueProperty];
            } else {
                map[key] = item;
            }
        }
    });

    return map;
}

const equal = function(object1, object2) {
    /*
     *To support infinite scroll (if required)
     *To replace circular objects(Removes TypeError: cyclic object value)
     */
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    return JSON.stringify(object1, getCircularReplacer()) === JSON.stringify(object2, getCircularReplacer());
}

function getDayLabel(date,
    requiredDateFormat='DD-MM-YYYY',
    currentDateFormat='YYYY-MM-DD',
    exceptionLabel='Not Available',
    showOnlyDate=false
) {
    /*
        Function expects a moment date object in the format
        example: requiredDateFormat = 'DD - MMM - YYYY'
    */
    let dayLabel = '';

    if (requiredDateFormat === null || requiredDateFormat === undefined) {
        console.warn(`requiredDateForm is '${requiredDateFormat}' in getDayLabel()`)
        requiredDateFormat = 'DD-MM-YYYY';
    }

    //Convert to moment if in string
    date = date instanceof moment
        ? date
        : typeof date === 'string'
            ? moment(date, currentDateFormat)
            : 'Invalid Date Format'
    ;

    if (date === 'Invalid Date Format') {
        return exceptionLabel;
    }

    //TODO: Temporary code. Should improve code
    if (!showOnlyDate) {
        if (date.isSame(moment(), 'day')) {
            dayLabel = 'Today';
        } else if (moment().subtract(1, 'days').isSame(date, 'day')) {
            dayLabel = 'Yesterday';
        }  else if (moment().add(1, 'days').isSame(date, 'day')) {
            dayLabel = 'Tomorrow';
        } else  {
            dayLabel = date.format(requiredDateFormat);
        }
    } else {
        dayLabel = date.format(requiredDateFormat);
    }

    return dayLabel;
}

// Converts a list of items into Select suitable options
const getOptions = function(list, label='name', value='value',labelKey='name', idKey='value') {
    var options = list.map(item => {
        return {
            [labelKey]: item[label],
            [idKey]: item[value],
        }
    });

    return options;
}

// Converts a map (object) to a list
const getList = function(object, property1, property2) {
    var list = [];
    for (var fieldName in object) {
        if (object.hasOwnProperty(fieldName)) {
            list.push({
                [property1]: fieldName,
                [property2]: object[fieldName],
            });
        }
    }

    return list;
}

const toLower = function(str) {
    return str ? str.toLowerCase() : str;
}

const toUpper = function(str) {
    return str ? str.toUpperCase() : str;
}

const loadStoredData = (storageKey) => {
    try {
        const storedData = localStorage.getItem(storageKey);
        console.log("usePaginatedData :: Initial Load :: storedData", storageKey, storedData);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return Array.isArray(parsedData) ? parsedData : [];
        }
    } catch (error) {
        console.error("Error loading stored data:", error);
    }
    return []; // Default to empty array if anything goes wrong
};


export {
    copy,
    equal,
    byString,
    getTime,
    getMap,
    getList,
    getOptions,
    getDayLabel,
    loadStoredData,

    toLower,
    toUpper,
}
