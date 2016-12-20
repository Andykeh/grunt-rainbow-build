/**
 * Created by andyk on 2016/12/14.
 * base
 */
var Fs    = require('fs'),
    grunt = require('grunt'),
    Crypto = require('crypto'),
    Path = require('path');


/*散列方法*/
var Hash = function(filePath, algorithm, encoding) {
    var hash = Crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filePath + '...');
    hash.update(grunt.file.read(filePath));
    return hash.digest(encoding);
};

/*匹配模式类型*/
var Patterns = {
    script:/<script.+src=['"]([^"']+)["']/gm,
    link:/<link[^\>]+href=['"]([^"']+)["']/gm,
    img:/<img[^\>]*[^\>\S]+src=['"]([^'"\)#]+)(#.+)?["']/gm,
    video: /<video[^\>]+src=['"]([^"']+)["']/gm,
    source: /<source[^\>]+src=['"]([^"']+)["']/gm,
    data: /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
    url:/url\(\s*['"]?([^"'\)]+)["']?\s*\)/gm,
    a: /<a[^\>]+href=['"]([^"']+)["']/gm,
    meta:/<meta[^\>]+content=['"]([^"']+)["']/gm,
    use: /<(?:use|image)[^\>]*[^\>\S]+xlink:href=['"]([^'"\)#]+)(#.+)?["']/gm
};

/*返回模式匹配文件
* grunt.file.expand([options, ] patterns)
* */
var GetLocator = function () {
    var locator;
   if (grunt.filerev && grunt.filerev.summary) {
        locator = grunt.filerev.summary;
    } else {
        locator = function (p) {
            return grunt.file.expand({
                filter: 'isFile'
            }, p);
        };
    }
    return locator;
};

/*输出文件路径，名等信息*/
var GetFilePath = function(file){
    var extName  = Path.extname(file), //扩展名
        baseName = Path.basename(file,extName), //不带扩展的文件名
        fileName = Path.basename(file),
        dirName  = Path.dirname(file);//路径


    return {
        'fileName'     : fileName,
        'extName'  : extName,
        'baseName' : baseName,
        'dirName'  : dirName
    };
};

var regexpQuote = function (str) {
    return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, '\\$1');
};

/*输出候选文件
* 文件名
* 搜索路径
* */
var GetCandidates = function(file, searchPath){
    var _fileInfo = GetFilePath(file),
        _candidates = [],
        hex = '[0-9a-fA-F]+',
        regPrefix = '(' + hex + '\\.' + regexpQuote(_fileInfo.baseName) + ')',
        regSuffix = '(' + regexpQuote(_fileInfo.baseName) + '\\.' + hex + regexpQuote(_fileInfo.extName) + ')',
        revvedRx = new RegExp(regPrefix + '|' + regSuffix);


    var _searchString = Path.join(searchPath, _fileInfo.baseName + '.*' + _fileInfo.extName),
        _prefixSearchString = Path.join(searchPath, '*.' + _fileInfo.baseName + _fileInfo.extName),
        _files = GetLocator()([_searchString, _prefixSearchString]);

    /*保留存在文件*/
    var goodFiles = _files.filter(function (f) {
        return f.match(revvedRx);
    });
    /*替换为引用路径*/
    goodFiles.forEach(function (gf) {
        var goodFileName = Path.basename(gf);

        if (!file.match(/\//)) {
            _candidates.push(goodFileName);
        } else {
            _candidates.push(_fileInfo.dirName + '/' + goodFileName);
        }
    });


    return _candidates;
};

/*返回替换后的内容*/


module.exports =  {
    MD5 : Hash,
    Fs  : Fs,
    Patterns : Patterns,
    Path : Path,
    GetFilePath : GetFilePath,
    GetCandidates:GetCandidates,
    GetLocator : GetLocator
};