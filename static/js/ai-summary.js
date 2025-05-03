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

const AISmmary = {
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
    container.innerHTML = `
      <div class="ai-summary-header">
        <div class="ai-summary-icon">🤖</div>
        <div class="ai-summary-title">文章摘要</div>
        <div class="ai-summary-model">QwenGPT</div>
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
        margin: 20px 0;
        padding: 15px;
        border-radius: 8px;
        background-color: rgba(240, 240, 240, 0.7);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .ai-summary-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .ai-summary-icon {
        font-size: 20px;
        margin-right: 8px;
      }
      .ai-summary-title {
        font-weight: bold;
        font-size: 16px;
        margin-right: auto;
      }
      .ai-summary-model {
        font-size: 12px;
        color: #666;
      }
      .ai-summary-content {
        line-height: 1.6;
        margin-bottom: 10px;
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
      }
      .ai-summary-report {
        color: #888;
        text-decoration: none;
      }
      .ai-summary-report:hover {
        text-decoration: underline;
      }
      [data-theme='dark'] .ai-summary {
        background-color: rgba(50, 50, 50, 0.7);
      }
      [data-theme='dark'] .ai-summary-model,
      [data-theme='dark'] .ai-summary-footer,
      [data-theme='dark'] .ai-summary-report {
        color: #aaa;
      }
    `;
    document.head.appendChild(style);

    // 插入到内容区域的顶部
    const contentElement = document.querySelector(this.config.aiSelector);
    if (contentElement) {
      contentElement.insertBefore(container, contentElement.firstChild);
    }
  },

  fetchSummary() {
    const contentElement = document.querySelector(this.config.aiSelector);
    if (!contentElement) return;

    const title = document.title;
    let content = contentElement.textContent.trim();
    
    // 限制内容长度
    content = content.replace(/\s+/g, ' ').substring(0, 2000);
    
    const summaryContent = document.getElementById('ai-summary-content');
    const apiUrl = `${this.config.aiApi}/?q=${encodeURIComponent(title + '，文章内容：' + content)}`;

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

// 导出配置和方法
window.aiConfig = aiConfig;
window.AISmmary = AISmmary;