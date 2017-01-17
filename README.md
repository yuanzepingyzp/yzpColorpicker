# yzpColorpicker
a color picker based on canvas and angularjs
##USEAGE
```html
<!DOCTYPE html>
<html>
    <title>yzpUI</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="Font-Awesome-3.2.1/css/font-awesome.css"></link>
    <link rel="stylesheet" href="yzpUI.css"></link>
    <body ng-app="app">
    <yzp-colorpicker label="请选择颜色" yzp-value="#646bf8"></yzp-colorpicker>
    <script src="angular.min.js"></script>
    <script src="yzpUI.js"></script>
  </body>
</html>
```
##API
```html
<yzp-colorpicker label="请选择颜色" /*String define the label of the colorpicker*/
                  yzp-value="#646bf8" /*String define the value*/
                  ></yzp-colorpicker>
```
##总结
###canvas中可以通过context.getImageData(x,y,1,1)来获取某一点的颜色信息,js中可以使用somenumber.toString(16);方法来将一个十进制数转成十六进制数，可以使用parseInt(someString,16)来将一个十六进制的字符串转为十进制数。
