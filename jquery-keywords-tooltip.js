(function ($) {
    $.fn.keywordify = function (options) {
        var flow, that = this, decorator;

        $.extend(options, {
            keywords:  {},
            delimiter: ',',
            decorator: function (phrase, tooltip) {
                return $('<span>')
                    .css({'text-decoration': 'underline', cursor: 'pointer'})
                    .attr({title: options.keywords[tooltip]})
                    .text(phrase)
                    .tooltipster();
            }
        });

        decorator = function (phrase) {
            var checkPhrase;

            for (checkPhrase in options.keywords) if (options.keywords.hasOwnProperty(checkPhrase)) {
                if ($.trim(phrase).toLowerCase() === $.trim(checkPhrase).toLowerCase()) {
                    return options.decorator(phrase, checkPhrase);
                }
            }

            return phrase;
        };

        if (options.keywordsUrl) {
            flow = $.getJSON(options.keywordsUrl)
                .then(function (data) {
                    options.keywords = data;
                })
        } else {
            flow = $.when(true);
        }

        flow.then(function () {
            that.each(function () {
                var i, phrases = $(this).text().split(options.delimiter), whitespace = {begin: '', end: ''};
                $(this).html('');
                for (i = 0; i < phrases.length; i += 1) {
                    whitespace.begin = phrases[i].match(/^(\s+)/);
                    whitespace.end = phrases[i].match(/(\s+)$/);
                    if (whitespace.begin) {
                        $(this).append(whitespace.begin[1]);
                    }

                    $(this).append(decorator($.trim(phrases[i])));

                    if (whitespace.end) {
                        $(this).append(whitespace.end[1]);
                    }

                    if (i < phrases.length - 1) {
                        $(this).append(options.delimiter);
                    }
                }
            });
        });


        return this;
    };
}(jQuery));
