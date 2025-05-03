/**
 * PJAX配置文件
 * 用于实现无刷新页面加载
 */

class PjaxConfig {
  constructor() {
    this.pjax = null;
    this.selectors = [
      "head title",
      "meta[name=description]", 
      "#content-wrapper",  // 根据实际主题结构调整
      ".page",            // 根据实际主题结构调整
      "#header-desktop",  // 如果需要刷新头部
      "#header-mobile"    // 如果需要刷新移动端头部
    ];
  }

  /**
   * 初始化PJAX
   */
  initPjax() {
    this.pjax = new Pjax({
      selectors: this.selectors,
      cacheBust: false,
      timeout: 5000
    });
    console.log('PJAX已初始化');
    this.setupEventListeners();
  }

  /**
   * 设置PJAX事件监听器
   */
  setupEventListeners() {
    // PJAX开始时执行
    document.addEventListener('pjax:send', () => {
      console.log('页面切换开始');
      // 可以在这里添加加载动画
    });

    // PJAX完成后执行
    document.addEventListener('pjax:complete', () => {
      console.log('页面切换完成');
      this.reloadScripts();
    });
  }

  /**
   * 重新加载页面上的脚本
   */
  // 在reloadScripts方法中添加
  reloadScripts() {
    // 重新初始化FixItBlog
    if (window.fixitBlog) {
      window.fixitBlog.init();
    }
    
    // 重新加载其他可能需要的脚本
    this.loadScript('/js/custom.js');
    this.loadScript('/js/ai-summary.js'); // 添加这一行
    
    // 如果有其他需要重新加载的脚本，可以在这里添加
  
  // 更新页面访问统计
  this.updateAnalytics();
  }
  
  // 添加统计更新方法
  updateAnalytics() {
  // Google Analytics
  if (window.gtag) {
    gtag('config', 'G-XXXXXXXXXX', {
      'page_path': window.location.pathname
    });
  }
  
  // 百度统计
  if (window._hmt) {
    _hmt.push(['_trackPageview', window.location.pathname + window.location.search]);
  }
  
  // 不蒜子统计
  if (typeof busuanzi !== 'undefined' && busuanzi.fetch) {
    busuanzi.fetch();
  }
  }
  
  /**
   * 加载脚本
   * @param {string} src - 脚本路径
   */
  loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }

  /**
   * 初始化
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initPjax();
    });
  }
}

/**
 * 立即执行
 */
(() => {
  window.pjaxConfig = new PjaxConfig();
  window.pjaxConfig.init();
})();