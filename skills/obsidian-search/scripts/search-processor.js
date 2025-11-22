#!/usr/bin/env node

/**
 * Obsidian Search Result Processor
 * 搜索结果处理和智能格式化工具
 */

class ObsidianSearchProcessor {
    constructor() {
        this.categories = {
            '技术文档': ['编程', '代码', 'api', '函数', '类', '方法', '算法', '数据结构'],
            '学习笔记': ['学习', '教程', '课程', '总结', '笔记', '复习', '概念'],
            '项目记录': ['项目', '开发', '实现', '功能', '需求', '设计', '架构'],
            '问题解决': ['问题', '错误', 'bug', '解决', '修复', '排查', '调试'],
            '思考感悟': ['思考', '感悟', '心得', '体会', '反思', '总结', '经验'],
            '资料收集': ['资料', '参考', '链接', '资源', '工具', '库', '框架'],
            '会议记录': ['会议', '讨论', '决策', '计划', '安排', '任务'],
            '创意灵感': ['想法', '创意', '灵感', '构思', '设计', '原型']
        };
    }

    /**
     * 智能分类搜索结果
     * @param {Array} results - 搜索结果数组
     * @returns {Object} 分类后的结果
     */
    categorizeResults(results) {
        const categorized = {
            '技术文档': [],
            '学习笔记': [],
            '项目记录': [],
            '问题解决': [],
            '思考感悟': [],
            '资料收集': [],
            '会议记录': [],
            '创意灵感': [],
            '其他': []
        };

        results.forEach(result => {
            const title = (result.title || result.name || result.filename || '').toLowerCase();
            const excerpt = (result.excerpt || result.snippet || '').toLowerCase();
            const path = (result.path || result.file || '').toLowerCase();

            const content = `${title} ${excerpt} ${path}`;
            let category = '其他';

            for (const [catName, keywords] of Object.entries(this.categories)) {
                if (keywords.some(keyword => content.includes(keyword))) {
                    category = catName;
                    break;
                }
            }

            categorized[category].push(result);
        });

        return categorized;
    }

    /**
     * 格式化分类后的搜索结果
     * @param {Object} categorizedResults - 分类后的结果
     * @param {string} query - 原始搜索查询
     * @returns {string} 格式化后的结果
     */
    formatCategorizedResults(categorizedResults, query) {
        let output = `🔍 搜索结果: '${query}'\n\n`;

        let totalResults = 0;
        Object.values(categorizedResults).forEach(results => {
            totalResults += results.length;
        });

        output += `📊 总结果数: ${totalResults} 条\n\n`;

        // 按类别显示结果
        for (const [category, results] of Object.entries(categorizedResults)) {
            if (results.length > 0) {
                output += `## ${category} (${results.length})\n\n`;

                results.forEach((result, index) => {
                    output += `${index + 1}. `;

                    const title = result.title || result.name || result.filename || '无标题';
                    const path = result.path || result.file || '';
                    const excerpt = result.excerpt || result.snippet || '';
                    const score = result.score || result.relevance || 0;

                    output += `**${title}**\n`;

                    if (path) {
                        output += `   📁 ${path}\n`;
                    }

                    if (excerpt) {
                        const cleanExcerpt = excerpt.replace(/\n+/g, ' ').trim();
                        const truncatedExcerpt = cleanExcerpt.length > 150
                            ? cleanExcerpt.substring(0, 150) + '...'
                            : cleanExcerpt;
                        output += `   💭 ${truncatedExcerpt}\n`;
                    }

                    if (score > 0) {
                        output += `   🎯 相关性: ${(score * 100).toFixed(1)}%\n`;
                    }

                    output += '\n';
                });

                output += '\n';
            }
        }

        return output;
    }

    /**
     * 生成相关搜索建议
     * @param {Array} results - 搜索结果
     * @param {string} originalQuery - 原始搜索查询
     * @returns {Array<string>} 相关搜索建议
     */
    generateRelatedSearches(results, originalQuery) {
        const suggestions = new Set();
        const queryWords = originalQuery.toLowerCase().split(/\s+/);

        // 从结果标题中提取相关词汇
        results.forEach(result => {
            const title = (result.title || result.name || result.filename || '').toLowerCase();
            const words = title.split(/\s+/)
                .filter(word => word.length > 2)
                .filter(word => !queryWords.includes(word));

            // 提取一些可能有用的词汇
            words.slice(0, 3).forEach(word => {
                if (word.length > 3) {
                    suggestions.add(`${originalQuery} ${word}`);
                }
            });
        });

        // 转换为数组并限制数量
        return Array.from(suggestions).slice(0, 5);
    }

    /**
     * 格式化搜索结果（简化版）
     * @param {Object} searchResults - 搜索结果对象
     * @returns {string} 格式化后的结果
     */
    formatSearchResults(searchResults) {
        if (!searchResults.success) {
            let output = `❌ 搜索错误: ${searchResults.error}\n\n`;

            // 显示搜索建议
            const suggestions = this.getSearchSuggestions(searchResults.query);
            if (suggestions.length > 0) {
                output += `💡 搜索建议:\n`;
                suggestions.forEach(suggestion => {
                    output += `  • ${suggestion}\n`;
                });
            }
            return output;
        }

        // 智能分类结果
        const categorized = this.categorizeResults(searchResults.results);
        let output = this.formatCategorizedResults(categorized, searchResults.query);

        // 如果有备注信息，添加到末尾
        if (searchResults.note) {
            output += `\n💡 ${searchResults.note}\n`;
        }

        // 添加搜索方法信息
        if (searchResults.method) {
            output += `\n🔧 搜索方法: ${searchResults.method}\n`;
        }

        // 相关搜索建议
        if (searchResults.results.length > 0) {
            const relatedSearches = this.generateRelatedSearches(searchResults.results, searchResults.query);
            if (relatedSearches.length > 0) {
                output += `\n🔍 相关搜索建议:\n`;
                relatedSearches.forEach(search => {
                    output += `  • ${search}\n`;
                });
            }
        }

        return output;
    }

    /**
     * 获取搜索建议
     * @param {string} query - 搜索查询
     * @returns {Array<string>} 建议列表
     */
    getSearchSuggestions(query) {
        const suggestions = [];

        if (!query || query.trim().length === 0) {
            suggestions.push('输入搜索关键词');
            return suggestions;
        }

        const queryLower = query.toLowerCase();

        // 通用搜索建议
        suggestions.push(
            '尝试使用不同的关键词',
            '检查拼写是否正确',
            '使用更具体或更广泛的关键词',
            '搜索相关的概念或同义词'
        );

        // Obsidian 特定建议
        if (queryLower.length > 10) {
            suggestions.push('尝试使用更短的关键词');
        } else if (queryLower.length < 3) {
            suggestions.push('使用更具体的关键词（至少3个字符）');
        }

        // 根据搜索内容类型提供建议
        if (queryLower.includes('如何') || queryLower.includes('how to')) {
            suggestions.push('尝试搜索具体的技术术语或概念');
        }

        return suggestions;
    }
}

// 命令行接口
if (require.main === module) {
    const ObsidianClient = require('./obsidian-client');
    const processor = new ObsidianSearchProcessor();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: node search-processor.js "<搜索查询>"');
        console.log('示例: node search-processor.js "JavaScript 异步编程"');
        process.exit(1);
    }

    const query = args.join(' ');

    const client = new ObsidianClient(
        'http://localhost:27123',
        '817b636609f33ba40076a41da1436155eb36cea7539f9e1178e019f4a97f6e3f'
    );

    client.searchNotes(query, 20)
        .then(results => {
            const formattedOutput = processor.formatSearchResults(results);
            console.log(formattedOutput);
        })
        .catch(error => {
            console.error('❌ 搜索处理失败:', error.message);
            process.exit(1);
        });
}

module.exports = ObsidianSearchProcessor;