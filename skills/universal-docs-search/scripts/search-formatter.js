#!/usr/bin/env node

/**
 * 搜索结果格式化器
 * 用于美化和组织技术文档搜索结果
 */

class SearchFormatter {
    constructor() {
        this.categories = {
            'api': '📡 API 文档',
            'tutorial': '📚 教程指南',
            'example': '💻 代码示例',
            'reference': '📖 参考文档',
            'guide': '🧭 操作指南',
            'configuration': '⚙️ 配置说明',
            'troubleshooting': '🔧 问题排查',
            'best-practices': '✨ 最佳实践',
            'other': '📄 其他文档'
        };
    }

    /**
     * 对搜索结果进行分类
     * @param {Array} results - 搜索结果数组
     * @returns {Object} 分类后的结果
     */
    categorizeResults(results) {
        const categorized = {};

        // 初始化分类
        Object.keys(this.categories).forEach(key => {
            categorized[key] = [];
        });

        results.forEach(result => {
            const category = this.determineCategory(result);
            categorized[category].push(result);
        });

        return categorized;
    }

    /**
     * 确定单个结果的分类
     * @param {Object} result - 单个搜索结果
     * @returns {string} 分类名称
     */
    determineCategory(result) {
        const title = (result.title || result.name || '').toLowerCase();
        const description = (result.description || result.summary || '').toLowerCase();
        const url = (result.url || result.link || '').toLowerCase();

        const content = `${title} ${description} ${url}`;

        // API 相关
        if (content.includes('api') || content.includes('method') ||
            content.includes('function') || content.includes('class')) {
            return 'api';
        }

        // 教程指南
        if (content.includes('tutorial') || content.includes('guide') ||
            content.includes('getting started') || content.includes('how to')) {
            return 'tutorial';
        }

        // 代码示例
        if (content.includes('example') || content.includes('demo') ||
            content.includes('sample') || content.includes('code')) {
            return 'example';
        }

        // 参考文档
        if (content.includes('reference') || content.includes('documentation') ||
            content.includes('docs') || content.includes('manual')) {
            return 'reference';
        }

        // 操作指南
        if (content.includes('guide') || content.includes('step-by-step') ||
            content.includes('walkthrough')) {
            return 'guide';
        }

        // 配置说明
        if (content.includes('configuration') || content.includes('config') ||
            content.includes('setup') || content.includes('install')) {
            return 'configuration';
        }

        // 问题排查
        if (content.includes('troubleshoot') || content.includes('error') ||
            content.includes('fix') || content.includes('debug')) {
            return 'troubleshooting';
        }

        // 最佳实践
        if (content.includes('best practice') || content.includes('pattern') ||
            content.includes('optimization') || content.includes('performance')) {
            return 'best-practices';
        }

        return 'other';
    }

    /**
     * 格式化分类后的搜索结果
     * @param {Object} categorizedResults - 分类后的结果
     * @param {string} query - 搜索查询
     * @returns {string} 格式化后的输出
     */
    formatCategorizedResults(categorizedResults, query) {
        let output = `🔍 技术文档搜索结果: "${query}"\n`;
        output += '=' .repeat(50) + '\n\n';

        let totalResults = 0;

        Object.entries(this.categories).forEach(([key, label]) => {
            const results = categorizedResults[key];
            if (results.length > 0) {
                totalResults += results.length;
                output += `${label} (${results.length})\n`;
                output += '-'.repeat(30) + '\n';

                results.forEach((result, index) => {
                    output += this.formatSingleResult(result, index + 1);
                });

                output += '\n';
            }
        });

        output += `📊 总计: ${totalResults} 个结果\n`;

        return output;
    }

    /**
     * 格式化单个搜索结果
     * @param {Object} result - 单个搜索结果
     * @param {number} index - 结果序号
     * @returns {string} 格式化后的单个结果
     */
    formatSingleResult(result, index = 1) {
        const title = result.title || result.name || '无标题';
        const description = result.description || result.summary || '无描述';
        const url = result.url || result.link || '无链接';

        let output = `${index}. **${title}**\n`;

        if (description && description !== '无描述') {
            // 限制描述长度
            const truncatedDesc = description.length > 150
                ? description.substring(0, 147) + '...'
                : description;
            output += `   ${truncatedDesc}\n`;
        }

        if (url && url !== '无链接') {
            output += `   🔗 ${url}\n`;
        }

        // 添加额外信息（如果有）
        if (result.version) {
            output += `   📌 版本: ${result.version}\n`;
        }

        if (result.author) {
            output += `   👤 作者: ${result.author}\n`;
        }

        if (result.updatedAt) {
            output += `   📅 更新: ${new Date(result.updatedAt).toLocaleDateString('zh-CN')}\n`;
        }

        output += '\n';

        return output;
    }

    /**
     * 创建搜索摘要
     * @param {Object} results - 搜索结果对象
     * @returns {string} 搜索摘要
     */
    createSearchSummary(results) {
        let summary = '## 搜索摘要\n\n';

        if (!results.success) {
            summary += `❌ 搜索失败: ${results.error}\n`;
            return summary;
        }

        const categorized = this.categorizeResults(results.results || []);
        const categoryCount = Object.values(categorized).filter(arr => arr.length > 0).length;

        summary += `- **查询**: "${results.query}"\n`;
        summary += `- **总结果**: ${results.totalResults}\n`;
        summary += `- **分类数量**: ${categoryCount}\n`;
        summary += `- **搜索耗时**: ${new Date().toLocaleTimeString('zh-CN')}\n\n`;

        // 显示各分类结果数量
        summary += '### 分类统计\n\n';
        Object.entries(this.categories).forEach(([key, label]) => {
            const count = categorized[key].length;
            if (count > 0) {
                summary += `- ${label}: ${count}\n`;
            }
        });

        return summary;
    }

    /**
     * 生成相关搜索建议
     * @param {string} originalQuery - 原始查询
     * @param {Object} results - 搜索结果
     * @returns {Array<string>} 相关搜索建议
     */
    generateRelatedSearches(originalQuery, results) {
        const suggestions = new Set();
        const queryLower = originalQuery.toLowerCase();

        // 基于框架的建议
        if (queryLower.includes('spring')) {
            suggestions.add('Spring Boot 自动配置');
            suggestions.add('Spring Security 认证');
            suggestions.add('Spring Data JPA');
        }

        if (queryLower.includes('react')) {
            suggestions.add('React Hooks 使用');
            suggestions.add('React 组件生命周期');
            suggestions.add('React 状态管理');
        }

        if (queryLower.includes('python')) {
            suggestions.add('Python 异步编程');
            suggestions.add('Python 虚拟环境');
            suggestions.add('Python 包管理');
        }

        if (queryLower.includes('javascript')) {
            suggestions.add('JavaScript ES6+ 特性');
            suggestions.add('JavaScript Promise');
            suggestions.add('JavaScript 模块系统');
        }

        // 基于结果类型的建议
        if (results.success && results.results) {
            const hasApiResults = results.results.some(r =>
                (r.title || '').toLowerCase().includes('api')
            );
            if (hasApiResults) {
                suggestions.add(`${originalQuery} API 方法`);
            }

            const hasTutorialResults = results.results.some(r =>
                (r.title || '').toLowerCase().includes('tutorial')
            );
            if (hasTutorialResults) {
                suggestions.add(`${originalQuery} 入门教程`);
            }
        }

        return Array.from(suggestions).slice(0, 5); // 限制建议数量
    }

    /**
     * 完整格式化搜索结果
     * @param {Object} results - 搜索结果对象
     * @returns {string} 完整格式化输出
     */
    formatCompleteResults(results) {
        let output = '';

        // 添加搜索摘要
        output += this.createSearchSummary(results);
        output += '\n';

        if (results.success && results.results) {
            // 分类和格式化结果
            const categorized = this.categorizeResults(results.results);
            output += this.formatCategorizedResults(categorized, results.query);

            // 添加相关搜索建议
            const relatedSearches = this.generateRelatedSearches(results.query, results);
            if (relatedSearches.length > 0) {
                output += '## 🔍 相关搜索建议\n\n';
                relatedSearches.forEach((suggestion, index) => {
                    output += `${index + 1}. ${suggestion}\n`;
                });
            }
        }

        return output;
    }
}

// 命令行接口
if (require.main === module) {
    const SearchFormatter = require('./search-formatter');
    const Context7Client = require('./context7-client');

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: node search-formatter.js "<搜索查询>"');
        console.log('示例: node search-formatter.js "spring boot configuration"');
        process.exit(1);
    }

    const query = args.join(' ');
    const client = new Context7Client();
    const formatter = new SearchFormatter();

    console.log(`🔍 正在搜索技术文档: ${query}`);
    console.log('⏳ 请稍候...\n');

    client.searchDocumentation(query, 20)
        .then(results => {
            const formattedOutput = formatter.formatCompleteResults(results);
            console.log(formattedOutput);
        })
        .catch(error => {
            console.error('❌ 搜索发生错误:', error.message);
            process.exit(1);
        });
}

module.exports = SearchFormatter;