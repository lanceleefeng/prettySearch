# prettySearch
Filter invalid query paramters and make urls shorter, based on jQuery. 
过滤无效的参数，使URL变得更短、更简洁，基于jQuery开发。

## 使用方法

### 表单同步提交
#### 手动调用：
$(formSelector).prettySearch();
或提供参数：
$(formSelector).prettySearch({
    defaultInvalid:'0;',
    invalid:{
        group:'0',
    },
    except: {
        mode: 1
    }
});


