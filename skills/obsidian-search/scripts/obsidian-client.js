#!/usr/bin/env node

/**
 * Obsidian API Client - JavaScript Implementation
 * 用于搜索本地 Obsidian 知识库的 API 客户端
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class ObsidianClient {
    constructor(baseUrl = 'http://localhost:27123', apiToken = '', timeout = 15000) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiToken = apiToken;
        this.timeout = timeout;
        this.defaultHeaders = {
            'User-Agent': 'Claude-Code-Obsidian-Search/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // 如果提供了 token，添加到头部
        if (this.apiToken) {
            this.defaultHeaders['Authorization'] = `Bearer ${this.apiToken}`;
        }
    }

    /**
     * 设置或更新 API Token
     * @param {string} token - 新的 API token
     */
    setApiToken(token) {
        this.apiToken = token;
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.defaultHeaders['Authorization'];
        }
    }

    /**
     * 检查 API Token 是否有效
     * @returns {boolean} token 是否存在且不为空
     */
    hasValidToken() {
        return this.apiToken && this.apiToken.trim().length > 0;
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

            if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
                const body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
                requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
            }

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

            if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
                const body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
                req.write(body);
            }

            req.end();
        });
    }

    /**
     * 检查 Obsidian API 连接状态
     * @returns {Promise<Object>} 连接状态
     */
    async checkConnection() {
        if (!this.hasValidToken()) {
            return {
                success: false,
                error: 'API Token 未配置',
                message: '请先配置 Obsidian Local REST API 的 API Token。你可以在 Obsidian 设置 → 第三方插件 → Local REST API 中找到它。'
            };
        }

        try {
            const response = await this.makeRequest(`${this.baseUrl}/`);
            return {
                success: true,
                message: 'Obsidian API 连接成功',
                apiInfo: response.data
            };
        } catch (error) {
            const isAuthError = error.message.includes('401') || error.message.includes('403');
            return {
                success: false,
                error: error.message,
                message: isAuthError
                    ? 'API Token 无效，请检查 Obsidian 设置中的 API Key 是否正确。'
                    : '无法连接到 Obsidian API，请检查：\n1. Obsidian 是否正在运行\n2. Obsidian 插件 "Local REST API" 是否已启用\n3. API 服务是否在 27123 端口运行'
            };
        }
    }

    /**
     * 搜索 Obsidian 知识库
     * @param {string} query - 搜索查询
     * @param {number} limit - 结果限制数量
     * @param {Object} options - 搜索选项
     * @returns {Promise<Object>} 搜索结果
     */
    async searchNotes(query, limit = 15, options = {}) {
        if (!query || query.trim().length === 0) {
            return {
                success: false,
                error: '搜索查询不能为空',
                query: query,
                suggestions: ['请输入搜索关键词']
            };
        }

        // 优先使用备用搜索方法，因为它更实用
        return await this.alternativeSearch(query, limit, options);
    }

    /**
     * 备用搜索方法 - 使用文件列表和内容过滤
     * @param {string} query - 搜索查询
     * @param {number} limit - 结果限制数量
     * @param {Object} options - 搜索选项
     * @returns {Promise<Object>} 搜索结果
     */
    async alternativeSearch(query, limit = 20, options = {}) {
        try {
            const startTime = Date.now();
            const queryLower = query.toLowerCase();
            const results = [];

            // 1. 首先搜索文件名
            const vaultResponse = await this.makeRequest(`${this.baseUrl}/vault/`);
            if (vaultResponse.statusCode === 200 && vaultResponse.data.files) {
                const files = vaultResponse.data.files.filter(file =>
                    file.endsWith('.md') && !file.endsWith('/')
                );

                // 搜索文件名匹配
                for (const file of files.slice(0, limit)) {
                    const fileName = file.toLowerCase();
                    if (fileName.includes(queryLower)) {
                        results.push({
                            title: file.replace(/\.md$/, ''),
                            path: file,
                            excerpt: `文件名匹配: ${file}`,
                            relevance: 1.0,
                            matchType: 'filename'
                        });
                    }
                }
            }

            // 2. 如果文件名匹配结果不够，尝试当前文件内容搜索
            if (results.length < limit) {
                try {
                    const activeFileResponse = await this.makeRequest(`${this.baseUrl}/active/`);
                    if (activeFileResponse.statusCode === 200) {
                        const content = activeFileResponse.data;
                        const contentStr = typeof content === 'string' ? content :
                                         (content.content ? content.content : JSON.stringify(content));

                        if (contentStr.toLowerCase().includes(queryLower)) {
                            // 提取匹配的上下文
                            const matches = this.extractContext(contentStr, query, 2);
                            const title = this.extractTitleFromContent(content);

                            results.push({
                                title: title,
                                path: 'current-file',
                                excerpt: matches.join('...'),
                                content: contentStr,
                                relevance: this.calculateRelevance(contentStr, query),
                                matchType: 'content'
                            });
                        }
                    }
                } catch (activeFileError) {
                    // 忽略获取当前文件时的错误
                    console.log('无法获取当前文件:', activeFileError.message);
                }
            }

            // 3. 如果还没有结果，尝试获取一些常见文件的内容进行搜索
            if (results.length === 0 && vaultResponse.statusCode === 200) {
                const commonFiles = ['README.md', 'Summary.md', '最近的文档.md'];

                for (const fileName of commonFiles) {
                    if (vaultResponse.data.files.includes(fileName)) {
                        try {
                            const noteResponse = await this.makeRequest(`${this.baseUrl}/file/${encodeURIComponent(fileName)}/`);
                            if (noteResponse.statusCode === 200) {
                                const content = typeof noteResponse.data === 'string' ? noteResponse.data :
                                               (noteResponse.data.content ? noteResponse.data.content : JSON.stringify(noteResponse.data));

                                if (content.toLowerCase().includes(queryLower)) {
                                    const matches = this.extractContext(content, query, 2);

                                    results.push({
                                        title: fileName.replace(/\.md$/, ''),
                                        path: fileName,
                                        excerpt: matches.join('...'),
                                        relevance: this.calculateRelevance(content, query),
                                        matchType: 'content'
                                    });

                                    if (results.length >= limit) break;
                                }
                            }
                        } catch (error) {
                            // 忽略单个文件读取错误
                            continue;
                        }
                    }
                }
            }

            // 按相关性排序
            results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

            return {
                success: true,
                query: query,
                results: results.slice(0, limit),
                totalResults: results.length,
                searchTime: Date.now() - startTime,
                method: 'file_and_content_search',
                note: results.length === 0 ? '未找到匹配的文件或内容' : null
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                query: query,
                suggestions: this.getSearchSuggestions(query)
            };
        }
    }

    /**
     * 从内容中提取上下文
     * @param {string} content - 文件内容
     * @param {string} query - 搜索查询
     * @param {number} contextLines - 上下文行数
     * @returns {Array<string>} 上下文片段
     */
    extractContext(content, query, contextLines = 3) {
        const lines = content.split('\n');
        const queryLower = query.toLowerCase();
        const matches = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(queryLower)) {
                const start = Math.max(0, i - contextLines);
                const end = Math.min(lines.length - 1, i + contextLines);
                const context = lines.slice(start, end + 1).join('\n');
                matches.push(context);
            }
        }

        return matches.slice(0, 5); // 限制返回的匹配数量
    }

    /**
     * 计算内容相关性
     * @param {string} content - 文件内容
     * @param {string} query - 搜索查询
     * @returns {number} 相关性评分 (0-1)
     */
    calculateRelevance(content, query) {
        const contentLower = content.toLowerCase();
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/);

        let matches = 0;
        let totalWords = queryWords.length;

        queryWords.forEach(word => {
            const occurrences = (contentLower.match(new RegExp(word, 'g')) || []).length;
            if (occurrences > 0) matches++;
        });

        return matches / totalWords;
    }

    /**
     * 获取当前活动笔记信息
     * @param {Object} options - 选项
     * @returns {Promise<Object>} 当前笔记信息
     */
    async getCurrentNote(options = {}) {
        try {
            const response = await this.makeRequest(`${this.baseUrl}/active/`);

            if (response.statusCode === 200) {
                const noteData = response.data;

                return {
                    success: true,
                    note: {
                        title: this.extractTitleFromContent(noteData),
                        content: typeof noteData === 'string' ? noteData : (noteData.content || ''),
                        path: typeof noteData === 'object' && noteData.path ? noteData.path : 'current-note',
                        tags: typeof noteData === 'object' && noteData.tags ? noteData.tags : [],
                        frontmatter: typeof noteData === 'object' && noteData.frontmatter ? noteData.frontmatter : {},
                        stat: typeof noteData === 'object' && noteData.stat ? noteData.stat : {}
                    }
                };
            } else {
                throw new Error(`HTTP ${response.statusCode}: 无法获取当前笔记`);
            }

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 从内容中提取标题
     * @param {string|Object} contentOrData - 内容或数据对象
     * @returns {string} 提取的标题
     */
    extractTitleFromContent(contentOrData) {
        let content = '';

        if (typeof contentOrData === 'string') {
            content = contentOrData;
        } else if (contentOrData.content) {
            content = contentOrData.content;
        }

        // 尝试从第一行提取标题
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
            const firstLine = lines[0].trim();
            // 检查是否是 Markdown 标题
            if (firstLine.startsWith('#')) {
                return firstLine.replace(/^#+\s*/, '');
            }
            return firstLine;
        }

        return '无标题笔记';
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

    /**
     * 格式化搜索结果
     * @param {Object} results - 搜索结果对象
     * @returns {string} 格式化后的结果字符串
     */
    formatSearchResults(results) {
        if (!results.success) {
            let output = `❌ 搜索错误: ${results.error}\n\n`;
            output += `💡 搜索建议:\n`;
            results.suggestions.forEach(suggestion => {
                output += `  • ${suggestion}\n`;
            });
            return output;
        }

        let output = `🔍 搜索结果: '${results.query}'\n`;
        output += `📊 找到结果: ${results.totalResults} 条\n`;
        if (results.searchTime) {
            output += `⏱️ 搜索耗时: ${(results.searchTime / 1000).toFixed(2)}s\n`;
        }
        output += '\n';

        if (results.results.length === 0) {
            output += '😔 没有找到匹配的笔记\n';
            return output;
        }

        results.results.forEach((result, index) => {
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
                // 截取过长的摘录
                const cleanExcerpt = excerpt.replace(/\n+/g, ' ').trim();
                const truncatedExcerpt = cleanExcerpt.length > 200
                    ? cleanExcerpt.substring(0, 200) + '...'
                    : cleanExcerpt;
                output += `   💭 ${truncatedExcerpt}\n`;
            }

            if (score > 0) {
                output += `   🎯 相关性: ${(score * 100).toFixed(1)}%\n`;
            }

            output += '\n';
        });

        return output;
    }

    
    /**
     * 显示搜索结果并提供建议
     * @param {string} query - 搜索查询
     * @param {number} limit - 结果限制
     * @param {Object} options - 搜索选项
     */
    async searchAndDisplay(query, limit = 20, options = {}) {
        console.log(`🔍 正在搜索 Obsidian 知识库: ${query}`);
        console.log('⏳ 请稍候...\n');

        const results = await this.searchNotes(query, limit, options);
        const formattedOutput = this.formatSearchResults(results);

        console.log(formattedOutput);

        // 显示搜索建议
        if (!results.success || results.totalResults === 0) {
            const suggestions = this.getSearchSuggestions(query);
            if (suggestions.length > 0) {
                console.log('💡 搜索建议:');
                suggestions.forEach(suggestion => {
                    console.log(`   • ${suggestion}`);
                });
            }
        }

        return results;
    }
}

// 命令行接口
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: node obsidian-client.js "<搜索查询>" [token]');
        console.log('示例: node obsidian-client.js "JavaScript 异步编程"');
        console.log('      node obsidian-client.js "--check" [token]  # 检查连接状态');
        console.log('');
        console.log('获取 API Token: 在 Obsidian 中进入 设置 → 第三方插件 → Local REST API');
        process.exit(1);
    }

      const isCheckCommand = args[0] === '--check';
    let apiToken = '';
    let query = '';

    if (isCheckCommand && args.length > 1) {
        // 如果是 --check 命令且有额外参数，第一个额外参数作为 token
        apiToken = args[1];
        query = '--check';
    } else if (!isCheckCommand && args.length > 0) {
        // 如果是搜索命令，检查最后一个参数是否是 token
        const lastArg = args[args.length - 1];
        if (lastArg && lastArg.length > 30) { // token 通常很长
            apiToken = lastArg;
            query = args.slice(0, -1).join(' ');
        } else {
            query = args.join(' ');
        }
    } else {
        query = args.join(' ');
    }

    const client = new ObsidianClient('http://localhost:27123', apiToken);

    if (query === '--check') {
        client.checkConnection()
            .then(result => {
                if (result.success) {
                    console.log('✅ ' + result.message);
                    if (result.apiInfo) {
                        console.log('📋 API 版本:', result.apiInfo.versions?.self || 'Unknown');
                        console.log('🔗 认证状态:', result.apiInfo.authenticated ? '已认证' : '未认证');
                    }
                } else {
                    console.log('❌ ' + result.message);
                }
                process.exit(0);
            })
            .catch(error => {
                console.error('❌ 连接检查失败:', error.message);
                process.exit(1);
            });
    } else {
        client.searchAndDisplay(query)
            .then(() => {
                process.exit(0);
            })
            .catch(error => {
                console.error('❌ 搜索失败:', error.message);
                process.exit(1);
            });
    }
}

module.exports = ObsidianClient;