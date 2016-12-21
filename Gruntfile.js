/*
 * grunt-rainbow-build
 * https://github.com/andyk/grunt-rainbow-build
 *
 * Copyright (c) 2016 葛兴华
 * Licensed under the MIT license.
 */

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
            'static':['script','link'], /*处理的静态资源类型*/
            'replace':['../','${STATIC_URI}'] /*自定义替换规则*/
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
