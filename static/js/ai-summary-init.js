// AI摘要初始化脚本
(function() {
  // 防止重复初始化
  if (window.aiSummaryInitialized) return;
  window.aiSummaryInitialized = true;
  
  // 检查是否在文章页面
  function isPostPage() {
    return /\/posts\//.test(location.pathname); // 简化路径匹配规则
  }
  
  // 初始化AI摘要
  function initAISummary() {
    if (typeof AISummary !== 'undefined') {
      console.log('正在初始化AI摘要...');
      // 确保API地址已设置
      if (!AISummary.config || !AISummary.config.aiApi) {
        window.aiConfig.aiApi = "https://ai-summary.xyz-liu15.workers.dev";
      }
      AISummary.init(window.aiConfig);
      console.log('AI摘要初始化完成');
    } else {
      console.error('AISummary未定义，请检查ai-summary.js是否正确加载');
    }
  }
  
  // 加载AI摘要脚本
  function loadAISummaryScript() {
    // 检查脚本是否已加载
    if (document.querySelector('script[src*="ai-summary.js"]')) {
      console.log('AI摘要脚本已存在，直接初始化');
      setTimeout(initAISummary, 100); // 短暂延迟确保脚本已执行
      return;
    }
    
    console.log('正在加载AI摘要脚本...');
    const script = document.createElement('script');
    script.src = '/js/ai-summary.js';
    script.onload = function() {
      console.log('AI摘要脚本加载完成');
      initAISummary();
    };
    script.onerror = function() {
      console.error('AI摘要脚本加载失败');
    };
    document.head.appendChild(script);
  }
  
  // 在DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (isPostPage()) {
        loadAISummaryScript();
      }
    });
  } else {
    // DOM已加载完成
    if (isPostPage()) {
      loadAISummaryScript();
    }
  }
})();