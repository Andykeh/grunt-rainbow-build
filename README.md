# grunt-rainbow-build

> rainbow build

## 开始
需要的Grunt版本 `~0.4.5`


安装
```shell
npm install grunt-rainbow-build --save-dev
```

在Gruntfile引入插件

```js
grunt.loadNpmTasks('grunt-rainbow-build');
```

## 散列文件名任务: "rainbow_hash" 
### 工程需要的插件
grunt-contrib-clean

### 开始配置
引入需要的插件，
并在在grunt初始化配置里增加任务
```js
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.initConfig({
    
});
```
####1.清除构建目录的文件
先使用 grunt-contrib-clean 做一些清除工作
```js
grunt.initConfig({
clean: {
      tests: ['test/jsdist','test/cssdist']
    }
})
```

####2.散列文件名配置
```js
grunt.initConfig({
  rainbow_hash: {
      options: {
                'hashMap':'hash_map/map.js' /*输出map文件*/
        },
      your_target: {
        options: {
          'fileType':'js',  /*文件类型*/
          'label':'script'  /*文件引入的标签类型*/
        },
        files: [{
            expand:true,   
            cwd:'test/js',
            dest : 'test/jsdist', /*资源将被拷贝到该目录*/
            src:['**/*.js']
        }]
      }
  }
});
```
##处理页面引入资源任务 "rainbow_use"
```js
grunt.initConfig({
rainbow_use:{
        options:{
            'static':['script','link'] /*处理的静态资源类型*/
        },
        dist:{
            files:[{
                expand:true,
                cwd:'test/html',
                dest : 'test/htmldist', /*页面资源将被拷贝到该目录*/
                src:['**/*.html'] 
            }]
        }

    }
})
```
##配置参考

```js
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      tests: ['test/jsdist','test/cssdist']
    },

    // 文件名散列命名
    rainbow_hash: {
        options: {
            'hashMap':'hash_map/map.js' /*输出map文件*/
        },
      hash_js: {
        options: {
          'fileType':'js',
          'label':'script'
        },
        files: [{
            expand:true,
            cwd:'test/js',
            dest : 'test/jsdist',
            src:['**/*.js']
        }]
      },
      hash_css: {
        options: {
            'fileType':'css',
            'label':'link'
        },
        files: [{
            expand:true,
            cwd:'test/css',
            dest : 'test/cssdist',
            src:['**/*.css']
        }]
      }
    },
    //处理引用
    rainbow_use:{
        options:{
            'static':['script','link'] /*处理的静态资源类型*/
        },
        dist:{
            files:[{
                expand:true,
                cwd:'test/html',
                dest : 'test/htmldist',
                src:['**/*.html']
            }]
        }

    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['clean', 'rainbow_hash', 'rainbow_use']);

};

```

