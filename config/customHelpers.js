
module.exports = {
    customEach: function(context, options) {
        var ret = "";
            for(var prop in context) {
                ret = ret + options.fn({property:prop,value:context[prop]});
            }
            return ret;
        },
    bar: function(obj){
        // console.warn('from infront!', obj);
        return '';
    },
    key_value: function(obj, options) {
        var buffer = "",
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += options.fn({key: key, value: obj[key]});
            }
        }

        return buffer;
    },
    each_with_key: function(obj, options) {
        var context,
            buffer = "",
            key,
            keyName = options.hash.key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                context = obj[key];

                if (keyName) {
                    context[keyName] = key;
                }


                buffer += options.fn(context);
            }
        }

        console.log(buffer);

        return buffer;
    },
    groupImages: function (val, options) {
        let groupedImages;
        groupedImages = [];

        options.forEach(key => {
            val.forEach(context => {
                if(context.group === options) {
                    groupedImages.push(context);
                }
            })
        })

        return groupedImages;
    }

}

