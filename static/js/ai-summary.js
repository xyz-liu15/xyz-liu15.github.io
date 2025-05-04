(function() {
  // 检查是否已加载
  if (window.aiSummaryLoaded) return;
  window.aiSummaryLoaded = true;
  
  /**
   * AI摘要功能
   */
  const aiConfig = {
    // AI摘要API地址
    aiApi: "https://ai-summary.xyz-liu15.workers.dev", // 直接设置API地址
    // 需要AI摘要的页面内容的选择器
    aiSelector: '.single .content',
    // 投诉链接
    reportUrl: "mailto:xyz.liu15@gmail.com?subject=文章摘要投诉&body=投诉网址：="+location.href,
    // 正则表达式启用ai摘要的路径
    enableAIPathRegex: /^\/(posts|zh-cn\/posts|en\/posts)\//,
    // AI描述
    aiGPTDesc: '我是一个基于DeepSeek大语言模型的AI摘要工具，它可以帮助你快速生成文章摘要，提高阅读体验。',
    // 启用翻译功能
    enableTranslation: true,
    // 翻译目标语言（auto表示自动检测并翻译到网页当前语言）
    targetLanguage: 'auto'
  };

  const AISummary = {
    init(config) {
      this.config = Object.assign({}, aiConfig, config);
      if (this.shouldEnableAI()) {
        this.createSummaryContainer();
        this.fetchSummary();
      }
    },
  
    shouldEnableAI() {
      return this.config.enableAIPathRegex.test(location.pathname);
    },
  
    createSummaryContainer() {
      const container = document.createElement('div');
      container.className = 'ai-summary';
      // 在createSummaryContainer方法中
      container.innerHTML = `
        <div class="ai-summary-header">
          <div class="ai-summary-icon">🤖</div>
          <div class="ai-summary-title">文章摘要</div>
          <div class="ai-summary-model">DeepSeek</div> <!-- 这里从QwenGPT改为DeepSeek -->
        </div>
        <div class="ai-summary-content" id="ai-summary-content">
          <div class="ai-summary-loading">正在生成摘要...</div>
        </div>
        <div class="ai-summary-footer">
          <div class="ai-summary-disclaimer">此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结</div>
          <a href="${this.config.reportUrl}" target="_blank" class="ai-summary-report">投诉</a>
        </div>
      `;
  
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .ai-summary {
          margin: 30px auto;
          padding: 20px;
          border-radius: 12px;
          background-color: rgba(240, 240, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #6b9eef;
          max-width: 100%;
          box-sizing: border-box;
        }
        .ai-summary-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ai-summary-icon {
          font-size: 24px;
          margin-right: 10px;
          color: #6b9eef;
        }
        .ai-summary-title {
          font-weight: bold;
          font-size: 18px;
          margin-right: auto;
          color: #333;
        }
        .ai-summary-model {
          font-size: 12px;
          color: #666;
          background-color: rgba(107, 158, 239, 0.1);
          padding: 3px 8px;
          border-radius: 12px;
        }
        .ai-summary-content {
          line-height: 1.8;
          margin-bottom: 15px;
          color: #444;
          font-size: 15px;
        }
        .ai-summary-loading {
          color: #666;
          font-style: italic;
        }
        .ai-summary-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #888;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .ai-summary-disclaimer {
          max-width: 80%;
        }
        .ai-summary-report {
          color: #6b9eef;
          text-decoration: none;
          font-weight: 500;
        }
        .ai-summary-report:hover {
          text-decoration: underline;
        }
        [data-theme='dark'] .ai-summary {
          background-color: rgba(40, 40, 40, 0.8);
          border-left: 4px solid #5183d7;
        }
        [data-theme='dark'] .ai-summary-title {
          color: #eee;
        }
        [data-theme='dark'] .ai-summary-content {
          color: #ccc;
        }
        [data-theme='dark'] .ai-summary-model {
          background-color: rgba(81, 131, 215, 0.2);
          color: #aaa;
        }
        [data-theme='dark'] .ai-summary-model,
        [data-theme='dark'] .ai-summary-footer,
        [data-theme='dark'] .ai-summary-disclaimer {
          color: #999;
        }
        [data-theme='dark'] .ai-summary-report {
          color: #5183d7;
        }
        
        /* 移动端适配 */
        @media (max-width: 768px) {
          .ai-summary {
            margin: 20px auto;
            padding: 15px;
          }
          .ai-summary-title {
            font-size: 16px;
          }
          .ai-summary-content {
            font-size: 14px;
          }
        }
      `;
      document.head.appendChild(style);
  
      // 查找文章内容元素
      const contentElement = document.querySelector(this.config.aiSelector);
      if (!contentElement) {
        console.error('未找到内容元素:', this.config.aiSelector);
        return;
      }
      
      // 查找文章标题元素
      const titleElement = document.querySelector('.single-title') || 
                           document.querySelector('h1.title') || 
                           document.querySelector('article h1') || 
                           document.querySelector('.post-title');
      
      // 查找目录元素
      const tocElement = document.querySelector('#toc-auto') || 
                      document.querySelector('.toc') ||
                      document.querySelector('.table-of-contents') ||
                      document.querySelector('[id^="TableOfContents"]');
      
      if (titleElement) {
        // 如果找到标题元素，将摘要插入到标题之后
        const parent = titleElement.parentNode;
        const nextElement = this.findNextContentElement(titleElement);
        
        if (nextElement) {
          parent.insertBefore(container, nextElement);
          console.log('AI摘要已插入到标题和内容之间');
        } else {
          // 如果找不到下一个元素，尝试插入到标题后面
          if (titleElement.nextSibling) {
            parent.insertBefore(container, titleElement.nextSibling);
          } else {
            parent.appendChild(container);
          }
          console.log('AI摘要已插入到标题后面');
        }
        
        // 不移动目录元素，保持其原有位置
        if (tocElement) {
          console.log('保持目录在原有位置');
        }
      } else {
        // 如果找不到标题，回退到原来的方案
        contentElement.insertBefore(container, contentElement.firstChild);
        console.log('未找到标题元素，AI摘要已插入到内容区域顶部');
      }
    },
    
    // 查找标题后的内容元素
    findNextContentElement(titleElement) {
      // 尝试查找常见的内容开始标记
      let current = titleElement.nextElementSibling;
      
      while (current) {
        // 检查是否是内容相关元素
        if (current.tagName === 'P' || 
            current.tagName === 'DIV' && (current.classList.contains('content') || current.classList.contains('post-content')) ||
            current.tagName === 'ARTICLE' ||
            current.tagName === 'SECTION') {
          return current;
        }
        
        // 检查是否是元数据元素，通常在标题和内容之间
        if (current.classList.contains('post-meta') || 
            current.classList.contains('post-info') ||
            current.classList.contains('post-header')) {
          // 跳过元数据，继续查找下一个元素
          current = current.nextElementSibling;
          continue;
        }
        
        // 如果找到了目录，也应该在目录之前插入
        if (current.id === 'toc-auto' || 
            current.classList.contains('toc') ||
            current.classList.contains('table-of-contents')) {
          return current;
        }
        
        current = current.nextElementSibling;
      }
      
      return null;
    },
  
    fetchSummary() {
      const contentElement = document.querySelector(this.config.aiSelector);
      if (!contentElement) {
        console.error('未找到内容元素:', this.config.aiSelector);
        return;
      }
      
      // 检查API地址是否已设置
      if (!this.config.aiApi) {
        console.error('API地址未设置，无法获取摘要');
        const summaryContent = document.getElementById('ai-summary-content');
        if (summaryContent) {
          summaryContent.innerHTML = 'API地址未设置，请检查配置。';
        }
        return;
      }
      
      console.log('使用API地址:', this.config.aiApi);
      const title = document.title;
      let content = contentElement.textContent.trim();
      
      // 限制内容长度，减少API请求大小
      content = content.replace(/\s+/g, ' ').substring(0, 800);
      
      const summaryContent = document.getElementById('ai-summary-content');
      
      // 获取当前页面语言
      const pageLang = document.documentElement.lang || 'zh-cn';
      const isEnglishPage = pageLang === 'en';
      
      // 始终使用英文提示词生成英文摘要，无论页面语言
      const prompt = `Please generate a brief summary under 100 words:`;
      
      // 添加随机参数和时间戳
      const randomSeed = Math.floor(Math.random() * 1000000);
      const timestamp = new Date().getTime();
      
      // 创建API URL，减少参数长度，强制使用英文生成摘要
      const apiUrl = `${this.config.aiApi}?q=${encodeURIComponent(title)}&content=${encodeURIComponent(content.substring(0, 400))}&lang=en&seed=${randomSeed}&t=${timestamp}`;
      
      // 显示加载状态 - 使用更简洁的加载动画
      const loadingText = isEnglishPage ? 'Generating summary' : '正在生成摘要';
      summaryContent.innerHTML = `<div class="ai-summary-loading">${loadingText}<span class="loading-dots"></span></div>`;
      
      // 添加加载动画
      const loadingStyle = document.createElement('style');
      loadingStyle.textContent = `
        .loading-dots:after {
          content: '.';
          animation: loading-dots 1s infinite;
        }
        
        @keyframes loading-dots {
          0% { content: '.'; }
          33% { content: '..'; }
          66% { content: '...'; }
        }
      `;
      document.head.appendChild(loadingStyle);
      
      // 使用EventSource进行流式接收
      const eventSource = new EventSource(apiUrl);
      let summary = '';
      
      // 准备打字机效果 - 使用更高效的DOM操作
      summaryContent.innerHTML = '';
      const typingElement = document.createElement('div');
      typingElement.className = 'typing-text';
      summaryContent.appendChild(typingElement);
      
      // 添加打字机效果的CSS - 优化动画性能
      const typingStyle = document.createElement('style');
      typingStyle.textContent = `
        .typing-text {
          border-right: 2px solid #6b9eef;
          animation: blink-caret 0.75s step-end infinite;
          white-space: pre-wrap;
          word-break: break-word;
          will-change: contents; /* 提示浏览器优化渲染 */
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #6b9eef }
        }
      `;
      document.head.appendChild(typingStyle);
      
      // 使用requestAnimationFrame优化渲染
      let pendingText = '';
      let animationFrameId = null;
      
      function updateText() {
        if (pendingText) {
          typingElement.textContent += pendingText;
          pendingText = '';
          // 自动滚动到底部
          summaryContent.scrollTop = summaryContent.scrollHeight;
        }
        animationFrameId = null;
      }
      
      // 处理流式响应 - 优化更新逻辑
      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          typingElement.classList.remove('typing-text');
          
          // 如果有待处理的文本，立即更新
          if (pendingText) {
            typingElement.textContent += pendingText;
            pendingText = '';
          }
          
          // 如果是中文页面，自动翻译英文摘要为中文
          if (!isEnglishPage && summary) {
            this.translateSummary(summary, summaryContent);
          }
          
          return;
        } else {
          try {
            const data = JSON.parse(event.data);
            if (data.response) {
              // 收集文本，但不立即更新DOM
              const newText = data.response;
              summary += newText;
              pendingText += newText;
              
              // 使用requestAnimationFrame批量更新DOM
              if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateText);
              }
            }
          } catch (e) {
            console.error('Error parsing event data:', e);
          }
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('EventSource错误:', error);
        eventSource.close();
        if (!summary) {
          // 如果API请求失败，生成一个简单的本地摘要
          const firstParagraph = content.split('\n\n')[0] || '';
          let localSummary = firstParagraph.substring(0, 150);
          if (localSummary.length >= 100) {
            localSummary += '...';
          }
          summaryContent.innerHTML = `<p>${localSummary}</p><p class="ai-summary-note">${isEnglishPage ? '(Local summary)' : '(本地生成的摘要)'}</p>`;
        } else {
          // 如果已经有部分摘要，保留它
          typingElement.classList.remove('typing-text');
        }
      };
    },
  
    // 翻译方法 - 优化翻译体验
    translateSummary(text, summaryContent) {
      console.log('开始翻译摘要');
      
      // 显示翻译中状态
      const originalText = text;
      summaryContent.innerHTML = `<div class="ai-summary-original">${originalText}</div><div class="ai-summary-translation"><div class="ai-summary-loading">正在翻译...<span class="loading-dots"></span></div></div>`;
      
      // 构建翻译请求
      const translateUrl = `${this.config.aiApi}?translate=true&text=${encodeURIComponent(text)}&target=zh-CN`;
      
      fetch(translateUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.translation) {
            // 只显示翻译后的中文摘要，不显示原始英文摘要
            summaryContent.innerHTML = `<div class="ai-summary-translation">${data.translation}</div>`;
            
            // 添加翻译样式
            const style = document.createElement('style');
            style.textContent = `
              .ai-summary-translation {
                font-weight: 500;
                color: #333;
              }
              [data-theme='dark'] .ai-summary-translation {
                color: #eee;
              }
            `;
            document.head.appendChild(style);
          } else {
            console.error('翻译失败:', data);
            summaryContent.innerHTML = originalText;
          }
        })
        .catch(error => {
          console.error('翻译请求错误:', error);
          summaryContent.innerHTML = originalText;
        });
    }
  };
  
  // 导出配置和方法（确保这里使用正确的变量名）
  window.aiConfig = aiConfig;
  window.AISummary = AISummary; // 正确的变量名
})();