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
        'posts': 'Posts',
        'ai-summary': 'Article Summary' // 添加这一行
        // 可以根据需要添加更多翻译
      },
      'zh-cn': {
        'archives': '归档',
        'tags': '标签',
        'categories': '分类',
        'search': '搜索',
        'menu': '菜单',
        'home': '首页',
        'posts': '文章',
        'ai-summary': '文章摘要' // 添加这一行
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

    // 翻译AI摘要元素
    const aiSummaryTitle = document.querySelector('.ai-summary-title');
    if (aiSummaryTitle && dict['ai-summary']) {
      aiSummaryTitle.textContent = dict['ai-summary'];
    }

    return this;
  }

  /**
   * 初始化AI摘要功能
   * @returns {FixItBlog}
   */
  initAISummary() {
    // 延迟初始化，确保ai-summary.js已加载
    setTimeout(() => {
      if (typeof window.AISummary !== 'undefined') {
        // 配置AI摘要
        // 根据语言选择不同的API端点
        const isEnglish = location.pathname.includes('/en/');
        window.aiConfig.aiApi = isEnglish 
          ? "https://ai-summary.xyz-liu15.workers.dev" 
          : "https://qw.geekswg.top"; // 使用您之前提到的备用API
        
        // 修改后：
        // 所有语言版本使用相同的API
        window.aiConfig.aiApi = "https://ai-summary.xyz-liu15.workers.dev";
        
        // 尝试多个可能的选择器
        const selectors = ['article', '.single .content', '#content-wrapper', '.content', 'main'];
        let foundSelector = false;
        
        for (const selector of selectors) {
          if (document.querySelector(selector)) {
            window.aiConfig.aiSelector = selector;
            foundSelector = true;
            console.log('找到有效选择器:', selector);
            break;
          }
        }
        
        if (!foundSelector) {
          console.warn('未找到有效的内容选择器，使用默认值');
          window.aiConfig.aiSelector = 'article';
        }
        
        window.aiConfig.reportUrl = "mailto:xyz.liu15@gmail.com?subject=文章摘要投诉&body=投诉网址：="+location.href;
        // 修改路径匹配规则，使其能匹配多语言路径
        window.aiConfig.enableAIPathRegex = /\/posts\//; // 只要路径中包含/posts/就匹配
        
        // 检查当前路径是否匹配
        const pathMatches = window.aiConfig.enableAIPathRegex.test(location.pathname);
        console.log('当前路径:', location.pathname, '是否匹配:', pathMatches);
        
        if (pathMatches) {
          // 添加错误处理
          // 替换现有的fetchSummary重写代码
          const originalFetchSummary = window.AISummary.fetchSummary;
          window.AISummary.fetchSummary = function() {
            try {
              console.log('开始获取AI摘要，语言:', document.documentElement.lang);
              console.log('内容选择器:', this.config.aiSelector);
              console.log('API地址:', this.config.aiApi);
              
              // 获取内容元素
              const contentElement = document.querySelector(this.config.aiSelector);
              if (!contentElement) {
                console.error('未找到内容元素:', this.config.aiSelector);
                const summaryContent = document.getElementById('ai-summary-content');
                if (summaryContent) {
                  summaryContent.innerHTML = '无法找到文章内容元素，请检查选择器配置。';
                }
                return;
              }
              
              originalFetchSummary.call(this);
            } catch (error) {
              console.error('AI摘要获取失败:', error);
              const summaryContent = document.getElementById('ai-summary-content');
              if (summaryContent) {
                summaryContent.innerHTML = '无法连接到AI摘要服务，请检查网络连接或稍后再试。';
              }
            }
          };
          
          // 初始化AI摘要
          window.AISummary.init(window.aiConfig);
          console.log('AI摘要初始化完成');
        } else {
          console.log('当前页面不符合AI摘要路径规则，跳过初始化');
        }
      } else {
        console.error('AISummary未定义，请检查ai-summary.js是否正确加载');
        
        // 尝试手动加载脚本
        const script = document.createElement('script');
        script.src = '/js/ai-summary.js';
        script.onload = () => {
          console.log('AI摘要脚本已手动加载，重新尝试初始化');
          this.initAISummary();
        };
        script.onerror = () => {
          console.error('无法加载AI摘要脚本，请检查文件路径');
        };
        document.head.appendChild(script);
      }
    }, 1000); // 延迟1秒执行，确保其他脚本已加载
    
    return this;
  }

  /**
   * initialize
   * @returns {FixItBlog}
   */
  init() {
    this.hello();
    this.setupLanguage();
    this.initAISummary(); // 添加这一行
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
// 在initAISummary方法中添加
console.log('当前语言:', isEnglish ? 'en' : 'zh-cn');
console.log('当前路径:', location.pathname);
console.log('是否匹配路径规则:', /\/posts\//.test(location.pathname));
