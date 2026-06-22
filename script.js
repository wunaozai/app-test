// ============================================================
// script.js — 多语言下拉切换 & i18n 渲染
// 支持: en / zh-CN / id / vi / fil
// ============================================================

(function () {
  'use strict';

  var DEFAULT_LANG = 'en';
  var LANG_ORDER = ['en', 'zh-CN', 'id', 'vi', 'fil'];

  var currentLang = DEFAULT_LANG;

  function t(key) {
    var dict = I18N[currentLang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }

  function applyTranslations() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      var text = t(key);
      if (text !== undefined) {
        els[i].textContent = text;
      }
    }
    document.title = t('page.title');
    updateLangBtn();
  }

  // 更新按钮显示当前语言
  function updateLangBtn() {
    var info = I18N[currentLang];
    var flagImg = document.querySelector('#lang-btn .lang-flag');
    var nameSpan = document.querySelector('#lang-btn .lang-name');
    if (flagImg) flagImg.src = flagUrl(currentLang);
    if (nameSpan) nameSpan.textContent = info['lang.name'];
  }

  function flagUrl(code) {
    var map = { en: 'gb', 'zh-CN': 'cn', id: 'id', vi: 'vn', fil: 'ph' };
    var c = map[code] || code;
    return 'https://flagcdn.com/24x18/' + c + '.png';
  }

  // 构建下拉菜单
  function buildDropdown() {
    var menu = document.getElementById('lang-menu');
    var btn = document.getElementById('lang-btn');
    if (!menu || !btn) return;

    // 构建选项
    for (var i = 0; i < LANG_ORDER.length; i++) {
      var code = LANG_ORDER[i];
      var info = I18N[code];
      var div = document.createElement('div');
      div.className = 'lang-option';
      div.setAttribute('data-lang', code);
      div.innerHTML = '<img class="lang-flag" src="' + flagUrl(code) + '" alt="" width="24" height="18"> ' + info['lang.name'];
      div.addEventListener('click', function () {
        currentLang = this.getAttribute('data-lang');
        applyTranslations();
        closeDropdown();
      });
      menu.appendChild(div);
    }

    // 按钮点击切换展开/收起
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = document.getElementById('lang-dropdown');
      dd.classList.toggle('open');
    });

    // 点击外部关闭
    document.addEventListener('click', function () {
      closeDropdown();
    });
  }

  function closeDropdown() {
    var dd = document.getElementById('lang-dropdown');
    if (dd) dd.classList.remove('open');
  }

  // 注入配置值（不需要多国语言）
  function applyConfig() {
    var el;

    el = document.getElementById('app-version');
    if (el) el.textContent = APP_CONFIG.version;

    el = document.getElementById('apk-name');
    if (el) el.textContent = 'APK (' + APP_CONFIG.version + ')';

    el = document.getElementById('apk-download-url');
    if (el) el.href = APP_CONFIG.downloadUrl;

    el = document.getElementById('file-size');
    if (el) el.textContent = APP_CONFIG.fileSize;

    el = document.getElementById('updated-date');
    if (el) el.textContent = APP_CONFIG.updatedDate;
  }

  function init() {
    currentLang = DEFAULT_LANG;
    applyConfig();
    buildDropdown();
    applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
