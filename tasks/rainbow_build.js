/*
 * grunt-rainbow-build
 * https://github.com/andyk/grunt-rainbow-build
 *
 * Copyright (c) 2016 葛兴华
 * Licensed under the MIT license.

 * 1.copy源文件到dest
 * 2.静态文件名增加散列值 hash
 * --输出map文件{'file':'hash file'}
 * 3.资源引入替换 use
 * --替换资源规则
 * --支持开启map
 *
 * link直接替换
 * seajs map规则替换
 * img 样式文件和页面文件引入的替换
 *
 */

'use strict';


var Base = require('../lib/base'),
    Path = require('path');



module.exports = function(grunt) {
  var  hashMap  = {},
       dist = {};


  /*资源文件散列文件名*/
  grunt.registerMultiTask('rainbow_hash', '文件名散列处理', function() {

    var options = this.options({
      'hashAlgorithm':'md5',
      'hashEncoding':'hex',
      'hashLength':8,
      'hashMap':'',
      'fileType':'text'
    }),
      taskName = this.target;
      hashMap[options.fileType] = {};


    this.files.forEach(function(f) {
      var _hash,_prefix,_renamed,_outPath,
          _src = f.src.filter(function(filePath) {
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file "' + filePath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filePath) {
        /*hash文件*/
        _hash = Base.MD5(filePath,options.hashAlgorithm,options.hashEncoding);
        _prefix = _hash.slice(0, options.hashLength);
        _renamed = [_prefix, Path.basename(filePath)].join('.');
        _outPath = f.orig.expand ? Path.dirname(f.dest)+'/' + _renamed : f.dest + _renamed;
        /*拷贝文件*/
        grunt.file.copy(filePath, _outPath );
        grunt.log.write('copy:',filePath + ' ').ok(_outPath);
        hashMap[options.fileType][Path.basename(filePath)] = _renamed;
      });

      /*dist目录*/
      dist[options.label] = Path.dirname(f.dest);

    });

    /*输出map文件*/
    if(options.hashMap){
        grunt.file.write(options.hashMap,
            'var RainbowHashMap ='+JSON.stringify(hashMap)
        );
    }
  });


  /*处理引用*/
  grunt.registerMultiTask('rainbow_use', '资源引用文件处理', function() {
      var options = this.options({
            'static':['script','link']
          });

      this.files.forEach(function(f){
        var _outPath,_src =  f.src.filter(function(filePath){
            if (!grunt.file.exists(filePath)) {
                grunt.log.warn('Source file "' + filePath + '" not found.');
                return false;
            } else {
                return true;
            }

        }).map(function(filePath){
            var _filePath = Base.GetFilePath(filePath);
                _outPath =  Path.dirname(f.dest)+'/'+_filePath.fileName;

            /*拷贝文件*/
            grunt.file.copy(filePath, _outPath );
            grunt.log.write('copy:',filePath + ' ').ok(_outPath);
            var _content = grunt.file.read(_outPath), /* == Fs.readFileSync(filePath).toString()*/
                _file;
            /*资源替换*/
            options.static.forEach(function(i,c){
                _content = _content.replace(Base.Patterns[i], function (match, src) {
                    _file = Base.GetCandidates(src,dist[i])[0];
                    if (!_file || src === '/') {
                        return match;
                    }

                    return match.replace(src, _file);
                });
            });


            /*写入内容*/
            grunt.file.write(_outPath, _content);
            grunt.log.write('write:',_outPath + ' ');
        })
      })
  })

};
