;(function (window, document) {
  'use strict';

  window.webPolyfills = {
    version: POLYFILLS_VERSION
  };

  /**
   * 获取操作系统名称
   * @returns {string} OS name
   */
  function getOSName() {
    var OSName = 'Unknown OS';
    var appVersion = navigator.appVersion;
    if (appVersion.indexOf('Win') !== -1) OSName = 'Windows';
    if (appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
    if (appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
    if (appVersion.indexOf('Linux') !== -1) OSName = 'Linux';
    return OSName;
  }

  /**
   * 获取Windows系统名称
   * @return {string} Windows OS name
   * @url https://msdn.microsoft.com/en-us/library/windows/desktop/ms724832%28v=vs.85%29.aspx
   */
  function getWindowsOSName() {
    var UA = navigator.userAgent;
    if (UA.indexOf('Windows NT 5.1') !== -1) return 'Windows XP';
    if (UA.indexOf('Windows NT 6.0') !== -1) return 'Windows Vista';
    if (UA.indexOf('Windows NT 6.1') !== -1) return 'Windows 7';
    if (UA.indexOf('Windows NT 6.2') !== -1) return 'Windows 8';
    if (UA.indexOf('Windows NT 6.3') !== -1) return 'Windows 8.1';
    if (UA.indexOf('Windows NT 10.0') !== -1) return 'Windows 10';
    var result = UA.match(/Windows.*;/);
    if (result) return result[0].slice(0, -1);
    return getOSName();
  }

  /**
   * 获取IE版本
   * @returns {number} IE version number
   * "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko"
   */
  function getIEVersion() {
    var version = navigator.userAgent.match(/(MSIE\s|Trident.*rv:)([\w.]+)/)[2];
    return parseFloat(version);
  }

  /**
   * 获取Safari版本
   * "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4"
   */
  function getSafariVersion() {
    var version = navigator.userAgent.match(/(Version\/)([\w.]+)/)[2];
    return parseFloat(version);
  }

  /**
   * 获取浏览器名称
   * @returns {string} Browser name
   */
  function getBrowserName() {
    var UA = navigator.userAgent;
    var isIE = UA.indexOf('MSIE') !== -1 || UA.indexOf('Trident') !== -1;
    var isIE11 = UA.indexOf('rv:11') !== -1;
    var isEdge = UA.indexOf('Edge') !== -1;
    var isChromeFrame = typeof window.externalHost !== 'undefined';
    var isSafari = (UA.indexOf('Safari') !== -1) && (UA.indexOf('Chrome') === -1);
    var isChrome = (UA.indexOf('Chrome') !== -1) && (navigator.vendor.indexOf('Google') > -1);
    var isFirefox = UA.indexOf('Firefox') !== -1;
    if (isIE) return 'IE' + getIEVersion();
    if (isChromeFrame) return 'Chrome Frame';
    if (isEdge) return 'Edge';
    if (isChrome) return 'Chrome';
    if (isSafari) return 'Safari';
    if (isFirefox) return 'Firefox';
    return 'Unknown browser';
  }

  /**
   * 加载 JS 脚本
   * @param {string} baseUrl
   * @param {string} url
   * @param {boolean} [async] 是否同步加载，默认异步加载
   */
  function loadScript(baseUrl, url, async) {
    var scriptUrl = baseUrl + url;
    if (async) {
      document.write('<script type="text/javascript" src="' + scriptUrl + '"><\/script>');
      return;
    }
    var docHead = document.head || document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.onload = function () {
    };
    script.onerror = function () {
      // Failed to load script
    };
    docHead.appendChild(script);
  }

  function hasClass(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  function addClass(element, className) {
    if (!hasClass(element, className)) {
      element.className += ' ' + className;
    }
  }

  /**
   * TODO: 暂时只处理IE/Edge on Windows
   */
  function addClassToBody() {
    var osClass = getWindowsOSName().toLowerCase().replace(/\s/g, '').replace(/\..*/g, '');
    var browserFullName = getBrowserName().toLowerCase().replace(/\s/g, '');
    var browserName = browserFullName.replace(/\d/g, '');
    // IE 10 以上才支持 classList
    if (!('classList' in Element.prototype)) {
      addClass(document.body, osClass);
      if (browserName) {
        addClass(document.body, browserName);
      }
      addClass(document.body, browserFullName);
    } else {
      document.body.classList.add(osClass);
      // 不支持空字符串和空格: classList.add('')/classList.add('class1 class2')
      if (browserName) {
        document.body.classList.add(browserName);
      }
      document.body.classList.add(browserFullName);
    }
  }

  // https://github.com/Modernizr/Modernizr/blob/master/lib/polyfills.json
  var scripts = {
    ie8: 'ie8-polyfills.js',
    ie9: 'ie9-polyfills.js',
    ie10: 'ie10-polyfills.js',
    ie11: 'ie11-polyfills.js',
    esNext: 'es-next-polyfills.js'
  };

  var selfEl = document.getElementById('web-polyfills');
  if (!selfEl) {
    console.warn('You need to specify the "id" attribute for the web-polyfills script element!');
    return;
  }
  var polyfillsBaseUrl = selfEl.getAttribute('data-base-url');
  if (!polyfillsBaseUrl) {
    console.warn('You need to specify the "data-base-url" attribute for the web-polyfills script element!');
    return;
  }
  if (polyfillsBaseUrl.substring(polyfillsBaseUrl.length - 1) !== '/') {
    polyfillsBaseUrl = polyfillsBaseUrl + '/';
  }

  var UA = navigator.userAgent;
  var isIE = UA.indexOf('MSIE') > -1 || UA.indexOf('Trident') > -1;
  var isChromeFrame = typeof window.externalHost !== 'undefined';
  var isIE11 = UA.indexOf('rv:11') > -1;
  var isWinXP = UA.indexOf('Windows NT 5.1') > -1;

  // IE8 on Windows XP 提示安装 Chrome Frame
  // IE8-10 on Windows 7/8.1 提示升级到 IE11
  if (isIE && !isIE11) {
    var warningEl = document.querySelector('.web-polyfills-browser-warning');
    var contentEl;
    if (isWinXP) {
      contentEl = document.querySelector('.web-polyfills-browser-warning > .win-xp');
    } else {
      contentEl = document.querySelector('.web-polyfills-browser-warning > .win-7');
    }
    if (contentEl) {
      contentEl.style.display = 'block';
    }
    if (warningEl) {
      warningEl.style.display = 'block';
    }
  }
  // 关闭提示
  var closeEl = document.querySelector('.web-polyfills-browser-warning > .close');
  if (closeEl) {
    closeEl.onclick = function (event) {
      document.querySelector('.web-polyfills-browser-warning').style.display = 'none';
    }
  }

  /**
   * - [x] IE/Chrome Frame/Safari 10.1以下版本 需要加载 FileSaver
   * - [x] 除 IE8，其他都可以加载 babel-polyfill
   * - [x] IE11 需要加载 babel-polyfill
   */
  var isSupportDownload = 'download' in document.createElement('a');

  // 加载 polyfills
  if (isIE) {
    var ieVersion = getIEVersion();
    var ieVersionStr = 'ie' + ieVersion;
    // IE8-9 直接使用条件注释的方式加载 polyfills
    // IE10-11 使用JS的的方式加载 polyfills
    if (ieVersion > 9) {
      loadScript(polyfillsBaseUrl, scripts[ieVersionStr], true);
    }
  } else {
    if (isChromeFrame || !isSupportDownload) {
      // loadScript(polyfillsBaseUrl, scripts.fileSaver, true);
    }
    // 不支持 ES2015+
    if (!Array.prototype.includes || !Object.values) {
      loadScript(polyfillsBaseUrl, scripts.esNext, true);
    }
  }

  // 添加操作系统和浏览器标识到body的class上
  addClassToBody();

}(window, document));
