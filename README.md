# web-polyfills

## Installation

```bash
npm install web-polyfills
```

## Usage

```html
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="renderer" content="webkit">
    <title>Example</title>
    <link rel="stylesheet" href="web-polyfills/lib/css/polyfills.css">
    <!--[if lte IE 8]>
    <script type="text/javascript" src="web-polyfills/lib/js/ie8-polyfills.js"></script>
    <![endif]-->
    <!--[if IE 9]>
    <script type="text/javascript" src="web-polyfills/lib/js/ie9-polyfills.js"></script>
    <![endif]-->
</head>
<body>
<div id="app"></div>
<div class="web-polyfills-browser-warning">
    <p class="win-7">检测到您的浏览器版本较低，请升级到最新的 <a target="_blank" href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads">Internet
            Explorer 11</a> 浏览器或者下载安装 <a target="_blank" href="https://dl.google.com/chrome/install/GoogleChromeframeStandaloneEnterprise.msi">Google
            Chrome Frame</a> 框架后打开。</p>
    <p class="win-xp">检测到您的浏览器版本较低，请下载安装 <a target="_blank" href="https://dl.google.com/chrome/install/GoogleChromeframeStandaloneEnterprise.msi">Google
            Chrome Frame</a> 后打开。</p>
    <a href="javascript:void(0);" class="close">&times;</a>
</div>
<script type="text/javascript" id="web-polyfills" data-base-url="web-polyfills/lib/js/" src="web-polyfills/lib/js/polyfills.js"></script>
</body>
</html>
```

