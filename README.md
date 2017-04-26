# prettySearch
Filter invalid query paramters and make urls shorter, based on jQuery.  
过滤无效的参数，使URL变得更短、更简洁，基于jQuery开发。

## 使用方法

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
#### 自动处理
给表单元素添加class ps-pretty-search，相当于`$(formSelector).prettySearch();`。  
可以通过设置表单属性、字段属性设置参数，后面有详解说明。  

_表单对象调用`prettySearch()`并不会提交表单_

### 异步提交
异步提交时返回过滤后的数据，提交、回调处理与原来一样：  
`var filteredDatas = $.prettySearch(datas);`  
传递的参数可以是JSON对象，也可以是参数字符串(serialize()返回结果)、参数数组(serializeArray()返回结果).
返回JSON对象







