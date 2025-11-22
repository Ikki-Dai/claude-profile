#!/usr/bin/env node

/**
 * Context7 API Client - JavaScript Implementation
 * 用于搜索技术文档的 Context7 API 客户端
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class Context7Client {
    constructor(baseUrl = 'https://context7.com/api/v1', timeout = 10000) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.timeout = timeout;
        this.defaultHeaders = {
            'User-Agent': 'Claude-Code-Tech-Docs-Search/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    /**
     * 执行 HTTP 请求
     * @param {string} url - 请求 URL
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} 响应数据
     */
    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const httpModule = isHttps ? https : http;

            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: { ...this.defaultHeaders, ...options.headers }
            };

            const req = httpModule.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const result = {
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: res.headers['content-type']?.includes('application/json')
                                ? JSON.parse(data)
                                : data
                        };

                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                        }
                    } catch (error) {
                        reject(new Error(`JSON解析错误: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`请求超时 (${this.timeout}ms)`));
            });

            req.setTimeout(this.timeout);
            req.end();
        });
    }

    /**
     * 搜索技术文档
     * @param {string} query - 搜索查询
     * @param {number} limit - 结果限制数量
     * @returns {Promise<Object>} 搜索结果
     */
    async searchDocumentation(query, limit = 10) {
        try {
            const encodedQuery = encodeURIComponent(query);
            const searchUrl = `${this.baseUrl}/search?query=${encodedQuery}&limit=${limit}`;

            const response = await this.makeRequest(searchUrl);

            return {
                success: true,
                query: query,
                results: response.data,
                totalResults: Array.isArray(response.data) ? response.data.length : 0
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                query: query,
                suggestions: this.getGeneralSuggestions()
            };
        }
    }

    /**
     * 获取特定项目文档
     * @param {string} projectName - 项目名称
     * @returns {Promise<Object>} 项目文档
     */
    async getProjectDocs(projectName) {
        try {
            const projectUrl = `${this.baseUrl}/spring-projects/${projectName}`;
            const response = await this.makeRequest(projectUrl);

            return {
                success: true,
                project: projectName,
                documentation: response.data
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                project: projectName
            };
        }
    }

    /**
     * 格式化搜索结果
     * @param {Object} results - 搜索结果对象
     * @returns {string} 格式化后的结果字符串
     */
    formatResults(results) {
        if (!results.success) {
            let output = `❌ 搜索错误: ${results.error}\n\n`;
            output += `💡 建议:\n`;
            results.suggestions.forEach(suggestion => {
                output += `  • ${suggestion}\n`;
            });
            return output;
        }

        let output = `🔍 搜索结果: '${results.query}'\n`;
        output += `📊 总结果数: ${results.totalResults}\n\n`;

        const searchResults = results.results;

        if (Array.isArray(searchResults)) {
            searchResults.forEach((result, index) => {
                output += `${index + 1}. `;

                if (typeof result === 'object' && result !== null) {
                    const title = result.title || result.name || '无标题';
                    const description = result.description || result.summary || '无描述';
                    const url = result.url || result.link || '无链接';

                    output += `**${title}**\n`;

                    if (description && description !== '无描述') {
                        output += `   ${description}\n`;
                    }

                    if (url && url !== '无链接') {
                        output += `   🔗 ${url}\n`;
                    }
                } else {
                    output += `${JSON.stringify(result)}\n`;
                }

                output += '\n';
            });
        } else {
            output += JSON.stringify(searchResults, null, 2);
        }

        return output;
    }

    /**
     * 获取查询改进建议
     * @param {string} query - 原始查询
     * @param {Object} results - 搜索结果
     * @returns {Array<string>} 建议列表
     */
    suggestImprovements(query, results) {
        const suggestions = [];

        if (!results.success) {
            return results.suggestions || [];
        }

        if (results.totalResults === 0) {
            suggestions.push(
                '使用更具体的关键词',
                '检查技术术语的拼写',
                '使用相关术语',
                '搜索更广泛的概念'
            );
        } else if (results.totalResults < 3) {
            suggestions.push(
                '尝试相关的搜索词',
                '在搜索中包含框架版本',
                '搜索特定的方法或类'
            );
        }

        // 框架特定建议
        const queryLower = query.toLowerCase();

        if (queryLower.includes('spring') && !queryLower.includes('boot')) {
            suggestions.push('尝试添加 "Spring Boot" 获得更具体的结果');
        }

        if (queryLower.includes('react') && !queryLower.includes('hooks')) {
            suggestions.push('尝试添加 "hooks" 获得 React 特定结果');
        }

        if (queryLower.includes('python')) {
            const pythonLibs = ['django', 'flask', 'fastapi', 'numpy', 'pandas'];
            if (!pythonLibs.some(lib => queryLower.includes(lib))) {
                suggestions.push('尝试指定 Python 框架 (Django, Flask, FastAPI 等)');
            }
        }

        return suggestions;
    }

    /**
     * 获取通用建议
     * @returns {Array<string>} 通用建议列表
     */
    getGeneralSuggestions() {
        return [
            '稍后再试',
            '使用不同的搜索词',
            '检查网络连接',
            '尝试更具体的查询'
        ];
    }

    /**
     * 显示搜索结果并提供建议
     * @param {string} query - 搜索查询
     * @param {number} limit - 结果限制
     */
    async searchAndDisplay(query, limit = 10) {
        console.log(`🔍 正在搜索: ${query}`);
        console.log('⏳ 请稍候...\n');

        const results = await this.searchDocumentation(query, limit);
        const formattedOutput = this.formatResults(results);

        console.log(formattedOutput);

        // 显示改进建议
        const suggestions = this.suggestImprovements(query, results);
        if (suggestions.length > 0) {
            console.log('💡 改进建议:');
            suggestions.forEach(suggestion => {
                console.log(`   • ${suggestion}`);
            });
        }

        return results;
    }
}

// 命令行接口
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: node context7-client.js "<搜索查询>"');
        console.log('示例: node context7-client.js "spring boot configuration"');
        process.exit(1);
    }

    const query = args.join(' ');
    const client = new Context7Client();

    client.searchAndDisplay(query)
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ 发生错误:', error.message);
            process.exit(1);
        });
}

module.exports = Context7Client;