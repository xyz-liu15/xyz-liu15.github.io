/**
 * Custom JavaScript for FixIt blog site.
 * @author @Lruihao https://lruihao.cn
 */
class FixItBlog {
  /**
   * say hello
   * you can define your own functions below
   * @returns {FixItBlog}
   */
  hello() {
    console.log('custom.js: Hello FixIt!');
    return this;
  }

  /**
   * 检测当前语言并设置相应的界面元素
   * @returns {FixItBlog}
   */
  setupLanguage() {
    // 获取当前URL路径
    const path = window.location.pathname;
    // 检测URL中是否包含语言代码
    const isEnglish = path.includes('/en/');
    const isChinese = path.includes('/zh-cn/') || (!isEnglish && !path.includes('/'));
    
    // 根据当前语言设置页面元素
    if (isEnglish) {
      // 英文环境下的处理
      document.documentElement.lang = 'en';
      // 处理可能未被Hugo自动翻译的元素
      this.translateElements('en');
    } else {
      // 中文环境下的处理
      document.documentElement.lang = 'zh-CN';
      // 处理可能未被Hugo自动翻译的元素
      this.translateElements('zh-cn');
    }
    
    return this;
  }

  /**
   * 翻译页面上的特定元素
   * @param {string} lang - 语言代码 ('en' 或 'zh-cn')
   * @returns {FixItBlog}
   */
  translateElements(lang) {
    // 定义翻译字典
    const translations = {
      'en': {
        'archives': 'Archives',
        'tags': 'Tags',
        'categories': 'Categories',
        'search': 'Search',
        'menu': 'Menu',
        'home': 'Home',
        'posts': 'Posts'
        // 可以根据需要添加更多翻译
      },
      'zh-cn': {
        'archives': '归档',
        'tags': '标签',
        'categories': '分类',
        'search': '搜索',
        'menu': '菜单',
        'home': '首页',
        'posts': '文章'
        // 可以根据需要添加更多翻译
      }
    };
  
    // 获取当前语言的翻译字典
    const dict = translations[lang] || translations['zh-cn'];
  
    // 查找页面上可能需要手动翻译的元素
    // 这里主要处理那些可能没有被Hugo自动翻译的元素
    // 例如通过JavaScript动态添加的元素
    
    // 示例：翻译具有特定data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 示例：处理搜索框占位符
    const searchInput = document.querySelector('.search-input');
    if (searchInput && dict['search']) {
      searchInput.placeholder = dict['search'] + '...';
    }

    return this;
  }

  /**
   * initialize
   * @returns {FixItBlog}
   */
  init() {
    this.hello();
    this.setupLanguage();
    return this;
  }
}

/**
 * immediate execution
 */
(() => {
  window.fixitBlog = new FixItBlog();
  // it will be executed when the DOM tree is built
  document.addEventListener('DOMContentLoaded', () => {
    window.fixitBlog.init();
  });
})();
