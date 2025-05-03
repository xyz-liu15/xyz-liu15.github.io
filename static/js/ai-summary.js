(function() {
  // 检查是否已加载
  if (window.aiSummaryLoaded) return;
  window.aiSummaryLoaded = true;
  
  /**
   * AI摘要功能
   */
  const aiConfig = {
    // AI摘要API地址
    aiApi: "", // 这里填写您的API地址，例如：https://your-worker-name.username.workers.dev
    // 需要AI摘要的页面内容的选择器
    aiSelector: '.single .content',
    // 投诉链接
    reportUrl: "mailto:xyz.liu15@gmail.com?subject=文章摘要投诉&body=投诉网址：="+location.href,
    // 正则表达式启用ai摘要的路径
    enableAIPathRegex: /^\/posts\//,
    // AI描述
    aiGPTDesc: '我是一个基于通义千问大语言模型（LLM）的AI摘要工具，它可以帮助你快速生成文章摘要，提高阅读体验。'
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
      if (!contentElement) return;
  
      const title = document.title;
      let content = contentElement.textContent.trim();
      
      // 限制内容长度
      content = content.replace(/\s+/g, ' ').substring(0, 2000);
      
      const summaryContent = document.getElementById('ai-summary-content');
      // Create the API URL with length parameter
      const apiUrl = `${this.config.aiApi}?q=${encodeURIComponent(title)}，请生成不超过100字的简短摘要：${encodeURIComponent(content)}`;
      
      // 使用EventSource进行流式接收
      const eventSource = new EventSource(apiUrl);
      let summary = '';
      
      eventSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          return;
        } else {
          try {
            const data = JSON.parse(event.data);
            summary += data.response;
            summaryContent.innerHTML = summary;
          } catch (e) {
            console.error('Error parsing event data:', e);
          }
        }
      };
      
      eventSource.onerror = () => {
        eventSource.close();
        if (!summary) {
          summaryContent.innerHTML = '无法生成摘要，请稍后再试。';
        }
      };
    }
  };
  
  // 导出配置和方法（确保这里使用正确的变量名）
  window.aiConfig = aiConfig;
  window.AISummary = AISummary; // 正确的变量名
})();