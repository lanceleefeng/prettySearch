# prettySearch
Filter invalid query paramters and make urls shorter, based on jQuery.  
过滤无效的参数，使URL变得更短、更简洁，基于jQuery开发。


## 效果

### 没有过滤参数时：
http://myhomepage.me/url?group=1&name=&url=&desc=&mode=&display=&break=&page=1
![不过滤无效参数](./images.git/no-filter.jpg)
### 过滤无效参数后：
http://myhomepage.me/url?group=1&page=1
![过滤无效参数](./images.git/pretty-search.jpg)


## 使用方法

_需要先引入插件JS文件_

### 同步提交
#### 手动调用：

```javascript

// formSelector 表示选中form的选择器
$(formSelector).prettySearch();
// 或提供参数：
$(formSelector).prettySearch({
    defaultInvalid:'0;',
    invalid:{
        group:'0',
    },
    except: {
        mode: 1
    }
});
```
_表单对象调用`prettySearch()`并不会提交表单_


#### 自动处理
给表单元素添加class pretty-search，相当于`$(formSelector).prettySearch();`。  
可以通过设置表单属性、字段属性设置参数，后面有详解说明。  


### 异步提交
异步提交时返回过滤后的数据，提交、回调处理与原来一样：  
`var filteredDatas = $.prettySearch(datas, options);`  
数据datas可以是JSON对象，也可以是参数字符串(serialize()返回结果)、参数数组(serializeArray()返回结果).  
options是过滤选项;  
返回JSON对象

## 过滤参数说明

### 调用prettySearch传递过滤参数
```js
var settings = {
    defaultInvalid: '0;', // 默认的无效值，'0;'表示0、空字符串
    invalid: {}, // 为具体参数指定无效值，如invalid:{page:1,pid:0,cid:''}
    except: {}, // 不过滤的参数，如except:{display:true,mode:1,group:0}
    separator:';.|/' // 无效值分割符，默认可用英文分号、句号、竖线、斜线
};

```

### 用HTML属性表示过滤参数

用HTML属性表示过滤参数时，需要给属性加前缀，默认是ps-。  
可以用set方法修改：
```js
$.prettySearch.setAttrPrefix('filter-');
$('form').prettySearch();
```

属性名由驼峰风格改为用-分割：  
ps-default-invalid、ps-separator为表单form的属性；  
ps-invalid、ps-except为单个表单元素如input、selelect的属性；  

示例：  

```html
<form name="search-form" class="pretty-search">
关键字：<input type="text" name="keywords" /> <input type="checkbox" name="strict" value="1" /> 精确匹配
</form>
```




```js
// 有.pretty-search的表单自动应用默认设置
$('form.pretty-search').prettySearch();
```


### 数组参数
对于数组参数：
只支持一维数组，不支持多级嵌套数组;
只有一条数据时也会过滤；  
给数组参数指定无效值或忽略时，键名不需要加[]；  
用ps-invalid属性指定无效值时，选项提取结果会把[]去掉，与用JSON对象设置参数一致。  
从HTML标记提取参数时，以ps-invalid属性为选择器，因此如果一组checkbox需要指定ps-invalid属性，在任何一个上指定即可，都写则以最后一个为准。

## 其它
用对象方法的形式提供过滤参数时，并不是立即使用，而是在提交时合并过滤参数，保存过滤参数用到了表单的name属性，同一页面多个表单使用prettySearch时需要设置name属性；  
对于同步提交的表单，支持混合使用HTML属性和函数调用的方式设置过滤参数，函数调用时设置的过滤参数，会覆盖HTML属性标记的。













