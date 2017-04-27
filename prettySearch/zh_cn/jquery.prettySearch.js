/*!
 * jquery prettySearch v 1.0
 * 过滤无效的请求参数
 * https://github.com/lanceleefeng/prettySearch/
 *
 * http://plugins.jquery.com/prettySearch/
 *
 * Author Lance Lee
 * http://lancelee.me/
 * http://lanceleefeng.com/
 *
 * Copyright onenet
 * http://onenet.wiki/
 *
 * Released under the MIT license
 * Date: 2017-4-24
 *
 */

;(function($){

    // 默认设置
    var settings = {
        defaultInvalid: '0;', // 默认的无效值，'0;'表示0、空字符串
        invalid: {}, // 为具体参数指定无效值，如invalid:{page:1,pid:0,cid:''}
        except: {}, // 不过滤的参数，如except:{display:true,mode:1,group:0}
        separator:';.|/' // 无效值分割符，默认可用英文分号、句号、竖线、斜线
    };

    var formOptions = {}; // 保存表单对象的options

    /**
     * 过滤无效数据
     * @param datas 要过滤的数据，可以是json对象，也可以是参数字符串(由serialize()获取)或参数数组(由serializeArray()获取)
     * @param options 过滤选项
     * @returns {{}} 返回JSON对象
     */

    $.prettySearch = function(datas, options) {
        var result = {};
        settings = $.extend(true, settings, options || {});

        if(typeof datas === 'string'){
            datas = queryStringToJSON(datas);
        }else if($.isArray(datas)){
            datas = $.param(datas);
            datas = queryStringToJSON(datas);
        }

        for(var key in datas){
            var val = datas[key];
            if(typeof settings.except[key] != 'undefined'){
                result[key] = val;
                continue;
            }

            if(typeof val == 'string'){
                if(!$.prettySearch.isInvalid(key, val)){
                    result[key] = val;
                }
            }else if($.isArray(val)){
                if(val.length === 1){
                    if(!$.prettySearch.isInvalid(key, val[0])){
                        result[key] = val;
                    }
                }else{
                    result[key] = val;
                }
            }
        }

        return result;
    };


    // 属性前缀（用HTML属性设置参数选项时使用）
    var attrPrefix = 'ps-';
    $.prettySearch.setAttrPrefix = function(prefix){
        attrPrefix = prefix;
    };

    /**
     * 判断某个键对应的值是否是无效值
     * @param key
     * @param val
     * @returns {boolean}
     */
    $.prettySearch.isInvalid = function (key, val){
        var invalidValStr = typeof settings.invalid[key] != 'undefined' ? settings.invalid[key] : settings.defaultInvalid;
        // var reg = new RegExp(settings.separator + val + settings.separator);
        // var reg = new RegExp('[' + settings.separator + ']\\s*' + val + '[' + settings.separator + ']\\s*');
        var reg = new RegExp('(^|[' + settings.separator + ']\\s*)' + val + '([' + settings.separator + ']\\s*|$)');
        var res = reg.test(invalidValStr);
        return res;
    };

    /**
     * 参数字符串转换为json对象
     * 支持字符串值和一维数组值
     * @param datas
     * @returns {{}}
     */
    var queryStringToJSON = function(datas) {

        var result = {};
        var arr = datas.split('&');

        var length = arr.length;
        for(var i=0; i<length; i++){
            var param = arr[i].split('=');
            var name = decodeURIComponent(param[0]);
            var val = decodeURIComponent(param[1]);

            if(name.slice(-2) == '[]'){
                name = name.slice(0, -2);
                if(typeof result[name] == 'undefined'){
                    result[name] = [];
                    result[name][0] = val;
                }else{
                    result[name][result[name].length] = val;
                }
            }else{
                result[name] = val;
            }
        }

        return result;
    };


    /**
     * 表单提交处理
     *
     * 获取表单数据、过滤选项并过滤数据
     * 用表单属性和过滤后的数据构造隐藏表单并提交
     * 取消原表单提交
     *
     * @param e
     * @returns {boolean}
     */
    var formPrettySearch = function(e){

        var form = $(this);

        var htmlOptions = {};
        var options = formOptions[form.attr('name')];

        var defaultInvalid = form.attr(attrPrefix + 'default-invalid');
        if(defaultInvalid){
            htmlOptions.defaultInvalid = defaultInvalid;
        }
        var separator = form.attr(attrPrefix + 'separator');
        if(separator){
            htmlOptions.separator = separator;
        }

        var attrInvalid = attrPrefix + 'invalid';
        var attrExcept = attrPrefix + 'except';

        var hasInvalid = false;
        var optionInvalid = {};

        var hasExcept = false;
        var optionExcept = {};

        form.find('[' + attrInvalid + ']').each(function(){
            hasInvalid = true;
            var name = $(this).attr('name');
            name = getStandardName(name);
            optionInvalid[name] = $(this).attr(attrInvalid);
        });


        // except属于支持类型checked、selected风格，
        // 同时支持指定值，0或false时表示不排除，其它均排除，包括不设置值
        form.find('[' + attrExcept + ']').each(function(){
            hasExcept = true;
            var name = $(this).attr('name');
            name = getStandardName(name);
            var val = $(this).attr(attrExcept);
            if(!(val === '0' || val === 'false')){
                optionExcept[name] = 1;
            }
        });

        if(hasInvalid){
            htmlOptions.invalid = optionInvalid;
        }
        if(hasExcept){
            htmlOptions.except = optionExcept;
        }

        options = $.extend(true, htmlOptions, options);

        var datas = form.serialize();
        datas = $.prettySearch(datas, options);

        // $.prettySearch.submit(datas, form);
        submit(datas, form);

        e.preventDefault();
        return false;
    };


    /**
     * 获取标准属性名
     * 数组类型的属性名以[]结尾时，需要去掉[]
     * @param name
     * @returns {*}
     */

    var getStandardName = function(name){
        if(name.slice(-2) == '[]'){
            name = name.slice(0, -2);
        }
        return name;
    };

    /**
     * 提交
     * 构造隐藏表单并提交
     *
     * @param datas
     * @param form
     */

    // $.prettySearch.submit = function(datas, form){
    var submit = function(datas, form){

        var formName = form.attr('name');
        var method = form.attr('method');
        var action = form.attr('action');

        var hiddenFormId = attrPrefix + formName;
        var formElementsHtml = elementsHtml(datas);
        var formHtml = '<form id="'+ hiddenFormId +'" style="display:none;">' + formElementsHtml + '</form>';

        // console.log(formHtml);
        // console.log(settings);
        // console.log(formOptions);

        $('body').append(formHtml);

        var hiddenForm = $('#' + hiddenFormId);
        if(action){
            hiddenForm.attr('action', action);
        }
        if(method){
            hiddenForm.attr('method', method);
        }
        hiddenForm.submit();
    };

    /**
     * 把json数据转换成表单元素
     *
     * @param datas
     * @returns {string}
     */
    var elementsHtml = function(datas){
        var result = [];
        for(var key in datas){
            var val = datas[key];
            if(typeof val === 'string'){
                result[result.length] = '<input type="hidden" name="'+key+'" value="'+val+'" />';
            }else if($.isArray(val)){
                var length = val.length;
                for(var i=0; i<length; i++){
                    result[result.length] = '<input type="hidden" name="'+key+'[]" value="'+val[i]+'" />';
                }
            }
        }
        return result.join('');
    };


    /**
     *
     * jq 表单对象方法
     * 绑定提交处理程序
     *
     * @param options
     * @returns {*}
     */

    $.fn.prettySearch = function(options){
        return this.filter('form').each(function(){
            var form = $(this);
            var formName = form.attr('name');
            formOptions[formName] = options;
            form.unbind('submit', formPrettySearch);
        }).submit(formPrettySearch);
    };

    // 有.pretty-search的表单自动应用默认设置
    $('form.pretty-search').prettySearch();

})(jQuery);
