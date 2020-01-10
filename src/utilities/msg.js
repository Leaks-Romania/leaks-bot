function pushError(message, errMsg) {
    message.reply(errMsg);
}

function getNiceTime(fromDate, toDate, levels, prefix) {
    var lang = {
            'date.past': '{0}',
            'date.future': '{0}',
            'date.now': 'now',
            'date.year': '**{0}** an',
            'date.years': '**{0}** ani',
            'date.years.prefixed': '**{0}** ani',
            'date.month': '**{0}** luna',
            'date.months': '**{0}** luni',
            'date.months.prefixed': '**{0}** luni',
            'date.day': '**{0}** zi',
            'date.days': '**{0}** zile',
            'date.days.prefixed': '**{0}** zile',
            'date.hour': '**{0}** ora',
            'date.hours': '**{0}** ore',
            'date.hours.prefixed': '**{0}** ore',
            'date.minute': '**{0}** minut',
            'date.minutes': '**{0}** minute',
            'date.minutes.prefixed': '**{0}** minute',
            'date.second': '**{0}** secunda',
            'date.seconds': '**{0}** secunde',
            'date.seconds.prefixed': '**{0}** secunde'
        },
        langFn = function(id, params) {
            var returnValue = lang[id] || '';

            if (params) {
                for (var i = 0; i < params.length; i++) {
                    returnValue = returnValue.replace('{' + i + '}', params[i]);
                }
            }

            return returnValue;
        },
        toDate = toDate ? toDate : new Date(),
        diff = fromDate - toDate,
        past = diff < 0 ? true : false,
        diff = diff < 0 ? diff * -1 : diff,
        date = new Date(new Date(1970, 0, 1, 0).getTime() + diff),
        returnString = '',
        count = 0,
        years = date.getFullYear() - 1970;

    if (years > 0) {
        var langSingle = 'date.year' + (prefix ? '' : ''),
            langMultiple = 'date.years' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (years > 1 ? langFn(langMultiple, [years]) : langFn(langSingle, [years]));
        count++;
    }

    var months = date.getMonth();
    if (count < levels && months > 0) {
        var langSingle = 'date.month' + (prefix ? '' : ''),
            langMultiple = 'date.months' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (months > 1 ? langFn(langMultiple, [months]) : langFn(langSingle, [months]));
        count++;
    } else {
        if (count > 0) count = 99;
    }

    var days = date.getDate() - 1;
    if (count < levels && days > 0) {
        var langSingle = 'date.day' + (prefix ? '' : ''),
            langMultiple = 'date.days' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (days > 1 ? langFn(langMultiple, [days]) : langFn(langSingle, [days]));
        count++;
    } else {
        if (count > 0) count = 99;
    }

    var hours = date.getHours();
    if (count < levels && hours > 0) {
        var langSingle = 'date.hour' + (prefix ? '' : ''),
            langMultiple = 'date.hours' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (hours > 1 ? langFn(langMultiple, [hours]) : langFn(langSingle, [hours]));
        count++;
    } else {
        if (count > 0) count = 99;
    }

    var minutes = date.getMinutes();
    if (count < levels && minutes > 0) {
        var langSingle = 'date.minute' + (prefix ? '' : ''),
            langMultiple = 'date.minutes' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (minutes > 1
                ? langFn(langMultiple, [minutes])
                : langFn(langSingle, [minutes]));
        count++;
    } else {
        if (count > 0) count = 99;
    }

    var seconds = date.getSeconds();
    if (count < levels && seconds > 0) {
        var langSingle = 'date.second' + (prefix ? '' : ''),
            langMultiple = 'date.seconds' + (prefix ? '.prefixed' : '');
        returnString +=
            (count > 0 ? ', ' : '') +
            (seconds > 1
                ? langFn(langMultiple, [seconds])
                : langFn(langSingle, [seconds]));
        count++;
    } else {
        if (count > 0) count = 99;
    }

    if (prefix) {
        if (returnString == '') returnString = langFn('date.now');
        else if (past) returnString = langFn('date.past', [returnString]);
        else returnString = langFn('date.future', [returnString]);
    }

    return returnString;
}

async function promptMessage(message, author, time, validReactions) {
    // We put in the time as seconds, with this it's being transfered to MS
    time *= 1000;

    // For every emoji in the function parameters, react in the good order.
    for (const reaction of validReactions) await message.react(reaction);

    // Only allow reactions from the author,
    // and the emoji must be in the array we provided.
    const filter = (reaction, user) =>
        validReactions.includes(reaction.emoji.name) && user.id === author.id;

    // And ofcourse, await the reactions
    return message
        .awaitReactions(filter, { max: 1, time: time })
        .then(collected => collected.first() && collected.first().emoji.name);
}

var SI_SYMBOL = ['', 'K', 'M', 'G', 'T', 'P', 'E'];

function abbreviateNumber(number) {
    var tier = (Math.log10(number) / 3) | 0;
    if (tier == 0) return number;
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    return scaled.toFixed(1) + suffix;
}

module.exports = { pushError, getNiceTime, promptMessage, abbreviateNumber };
